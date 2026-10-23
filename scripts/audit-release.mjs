// Audit every prerendered page, and optionally its published HTTP response.
// Usage: node scripts/audit-release.mjs [https://designseichas.ru]
import { readFile, stat, writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { JSDOM } from 'jsdom';
import { GOOGLE_TAG_URL, GOOGLE_TAG_INIT } from '../src/shared/config/googleTag.js';

const root = join(process.cwd(), 'build/client');
const origin = 'https://designseichas.ru';
const liveOrigin = process.argv[2];
const errors = [];
const pages = [];
const titles = new Map();
const descriptions = new Map();
const brand = 'Дизайн Сейчас';
const homePaths = new Set(['/', '/en/', '/by/']);
const alternatesByUrl = new Map();

// In live mode inspect the published discovery files, not just the local build.
async function readDiscoveryFile(name) {
  if (!liveOrigin) return readFile(join(root, name), 'utf8');
  const response = await fetch(new URL(`/${name}`, liveOrigin), {
    redirect: 'manual',
    signal: AbortSignal.timeout(20000),
  });
  if (response.status !== 200) errors.push(`${name}: HTTP ${response.status}, expected 200`);
  return response.text();
}

const sitemap = new JSDOM(await readDiscoveryFile('sitemap.xml'), {
  contentType: 'text/xml',
});
const sitemapDocument = sitemap.window.document;
if (
  sitemapDocument.documentElement.localName !== 'urlset' ||
  sitemapDocument.documentElement.namespaceURI !== 'http://www.sitemaps.org/schemas/sitemap/0.9'
)
  errors.push('sitemap.xml: expected a sitemap urlset');
const sitemapEntries = [...sitemapDocument.getElementsByTagName('url')];
const urls = sitemapEntries.map((entry) => entry.querySelector('loc')?.textContent.trim());
const urlSet = new Set(urls);
if (!urls.length) errors.push('sitemap.xml: no page URLs');
if (urls.length !== urlSet.size) errors.push('sitemap.xml: duplicate page URLs');
const xmlAlternatesByUrl = new Map(
  sitemapEntries.map((entry, index) => [
    urls[index],
    [...entry.getElementsByTagNameNS('http://www.w3.org/1999/xhtml', 'link')].map((link) => ({
      language: link.getAttribute('hreflang'),
      href: link.getAttribute('href'),
      rel: link.getAttribute('rel'),
    })),
  ]),
);
if (liveOrigin) {
  const localSitemap = new JSDOM(await readFile(join(root, 'sitemap.xml'), 'utf8'), {
    contentType: 'text/xml',
  });
  const localUrls = [...localSitemap.window.document.getElementsByTagName('loc')].map((node) =>
    node.textContent.trim(),
  );
  if (JSON.stringify([...urls].sort()) !== JSON.stringify(localUrls.sort()))
    errors.push('sitemap.xml: published page URLs differ from the release build');
  localSitemap.window.close();
}
const robots = await readDiscoveryFile('robots.txt');
const declaredSitemaps = [...robots.matchAll(/^\s*Sitemap:\s*(\S+)\s*$/gim)].map(
  (match) => match[1],
);
if (!declaredSitemaps.includes(`${origin}/sitemap.xml`))
  errors.push('robots.txt: missing canonical Sitemap declaration');

function expectedAlternates(path) {
  const base = path.replace(/^\/(?:en|by)(?=\/)/, '') || '/';
  return [
    { language: 'ru-RU', href: `${origin}${base}`, rel: 'alternate' },
    { language: 'en', href: `${origin}/en${base}`, rel: 'alternate' },
    { language: 'be-BY', href: `${origin}/by${base}`, rel: 'alternate' },
    { language: 'x-default', href: `${origin}${base}`, rel: 'alternate' },
  ];
}

function serializeAlternates(links) {
  return JSON.stringify(
    links.map(({ language, href, rel }) => `${language}|${href}|${rel}`).sort(),
  );
}

function hasSchemaType(node, type) {
  return [node?.['@type']].flat().includes(type);
}

function checkAnalytics(doc, check) {
  const googleTags = [...doc.querySelectorAll('script[src]')].filter(
    (script) => script.getAttribute('src') === GOOGLE_TAG_URL,
  );
  check(googleTags.length === 1, 'expected exactly one Google tag');
  check(googleTags[0]?.hasAttribute('async'), 'Google tag must load asynchronously');
  const googleInit = doc.querySelectorAll('script#google-analytics-init');
  check(googleInit.length === 1, 'expected exactly one Google Analytics initialization');
  check(googleInit[0]?.textContent.trim() === GOOGLE_TAG_INIT, 'Google Analytics config mismatch');
  const scripts = doc.querySelectorAll('script[src="/metrika.js"]');
  check(scripts.length === 1, 'expected exactly one Metrika script');
  check(scripts[0]?.hasAttribute('defer'), 'Metrika script must use defer');
  const pixels = doc.querySelectorAll('img[src="https://mc.yandex.ru/watch/113598335"]');
  check(pixels.length === 1, 'expected exactly one Metrika pixel');
  check(!!pixels[0]?.closest('body noscript'), 'Metrika pixel must be inside body noscript');
  check(
    doc.querySelector('meta[property="og:site_name"]')?.content === brand,
    'og:site_name mismatch',
  );
}

function checkHomeSchema(doc, check) {
  const scripts = doc.querySelectorAll('script[type="application/ld+json"]');
  check(scripts.length === 1, 'expected one homepage structured data graph');
  if (scripts.length !== 1) return;
  let schema;
  try {
    schema = JSON.parse(scripts[0].textContent);
  } catch {
    check(false, 'invalid structured data JSON');
    return;
  }
  check(schema?.['@context'] === 'https://schema.org', 'structured data context mismatch');
  const graph = Array.isArray(schema?.['@graph']) ? schema['@graph'] : [];
  const websites = graph.filter((node) => hasSchemaType(node, 'WebSite'));
  const organizations = graph.filter((node) => hasSchemaType(node, 'Organization'));
  check(websites.length === 1, 'expected one WebSite entity');
  check(organizations.length === 1, 'expected one Organization entity');
  const website = websites[0];
  const organization = organizations[0];
  for (const entity of [website, organization]) {
    check(entity?.name === brand, 'structured data brand mismatch');
    check(
      Array.isArray(entity?.alternateName) && entity.alternateName.includes('ДизайнСейчас'),
      'missing compact brand alias',
    );
    check(entity?.url === `${origin}/`, 'structured data must use canonical domain homepage');
  }
  check(
    organization?.['@id'] === `${origin}/#organization`,
    'Organization must have a stable domain ID',
  );
  check(
    !!organization?.['@id'] && website?.publisher?.['@id'] === organization['@id'],
    'WebSite publisher must reference Organization',
  );
}

async function exists(path) {
  try {
    return (await stat(path)).isFile();
  } catch {
    return false;
  }
}

if (!(await exists(join(root, 'metrika.js')))) errors.push('Missing metrika.js build asset');

for (const url of urls) {
  if (!URL.canParse(url)) {
    errors.push(`sitemap.xml: invalid absolute URL ${url}`);
    continue;
  }
  const path = new URL(url).pathname;
  const check = (condition, message) => {
    if (!condition) errors.push(`${path}: ${message}`);
  };
  check(url === origin + path, 'sitemap URL must use the canonical origin without query/hash');
  check(path.endsWith('/'), 'sitemap URL needs final slash');
  let html;
  if (liveOrigin) {
    const response = await fetch(new URL(path, liveOrigin), { redirect: 'manual' });
    check(response.status === 200, `HTTP ${response.status}`);
    check(
      !/(?:^|[\s,:])(?:noindex|none)(?:$|[\s,])/i.test(response.headers.get('x-robots-tag') ?? ''),
      'indexable page must not use an HTTP noindex directive',
    );
    html = await response.text();
    if (path !== '/') {
      const redirect = await fetch(new URL(path.slice(0, -1), liveOrigin), { redirect: 'manual' });
      check(
        [301, 308].includes(redirect.status),
        `slashless URL HTTP ${redirect.status}, expected permanent redirect`,
      );
      check(
        new URL(redirect.headers.get('location') ?? '', liveOrigin).pathname === path,
        'redirect destination',
      );
    }
  } else {
    html = await readFile(join(root, path, 'index.html'), 'utf8');
  }
  const dom = new JSDOM(html, { url });
  const doc = dom.window.document;
  const expectedLanguage = path.startsWith('/en/')
    ? 'en'
    : path.startsWith('/by/')
      ? 'be-BY'
      : 'ru-RU';
  check(doc.documentElement.lang === expectedLanguage, 'HTML language does not match the route');
  checkAnalytics(doc, check);
  if (homePaths.has(path)) checkHomeSchema(doc, check);
  const meta = (selector) => doc.querySelector(selector)?.getAttribute('content');
  const title = doc.title.trim();
  const description = meta('meta[name="description"]');
  check(
    ![...doc.querySelectorAll('meta[name="robots"], meta[name="googlebot"]')].some((node) =>
      /(?:^|[\s,])(?:noindex|none)(?:$|[\s,])/i.test(node.content),
    ),
    'indexable page must not use noindex',
  );
  check(doc.querySelectorAll('h1').length === 1, 'expected exactly one H1');
  check(!!title, 'empty title');
  check(!!description, 'empty description');
  check(!titles.has(title), `duplicate title with ${titles.get(title)}`);
  check(
    !descriptions.has(description),
    `duplicate description with ${descriptions.get(description)}`,
  );
  titles.set(title, path);
  descriptions.set(description, path);
  check(doc.querySelectorAll('link[rel="canonical"]').length === 1, 'one canonical required');
  check(doc.querySelector('link[rel="canonical"]')?.href === url, 'canonical mismatch');
  check(meta('meta[property="og:url"]') === url, 'og:url mismatch');
  const alternates = [...doc.querySelectorAll('link[hreflang]')].map((link) => ({
    language: link.getAttribute('hreflang'),
    href: link.getAttribute('href'),
    rel: link.getAttribute('rel'),
  }));
  const expected = serializeAlternates(expectedAlternates(path));
  check(
    serializeAlternates(alternates) === expected,
    'expected exact reciprocal RU/EN/BE/x-default language URLs',
  );
  check(
    serializeAlternates(xmlAlternatesByUrl.get(url) ?? []) === serializeAlternates(alternates),
    'HTML and Sitemap hreflang differ',
  );
  for (const alternate of alternates)
    check(urlSet.has(alternate.href), `missing alternate ${alternate.href}`);
  alternatesByUrl.set(url, alternates);
  const ogImage = meta('meta[property="og:image"]');
  check(!!ogImage, 'missing OG image');
  if (ogImage && new URL(ogImage, origin).origin === origin)
    check(
      await exists(join(root, new URL(ogImage, origin).pathname)),
      `missing OG image ${ogImage}`,
    );
  for (const img of doc.querySelectorAll('img')) {
    check(img.hasAttribute('alt'), `missing alt ${img.src}`);
    for (const source of [
      img.src,
      ...(img.srcset
        ? img.srcset.split(',').map((item) => new URL(item.trim().split(' ')[0], url).href)
        : []),
    ]) {
      const imageUrl = new URL(source, url);
      if (imageUrl.origin === origin)
        check(await exists(join(root, imageUrl.pathname)), `missing image ${source}`);
    }
  }
  for (const anchor of doc.querySelectorAll('a[href]')) {
    const target = new URL(anchor.href, url);
    if (target.origin !== origin) continue;
    if (/\.[a-z0-9]+$/i.test(target.pathname)) {
      check(await exists(join(root, target.pathname)), `missing asset ${target.pathname}`);
    } else {
      check(
        urls.includes(origin + target.pathname),
        `noncanonical or missing internal URL ${target.pathname}`,
      );
      if (target.hash && target.pathname === path) {
        check(
          !!doc.getElementById(decodeURIComponent(target.hash.slice(1))),
          `missing anchor ${target.hash}`,
        );
      }
    }
  }
  check(!/"@type"\s*:\s*"(?:Review|AggregateRating)"/.test(html), 'unverified review schema');
  check(
    !/(?:500\+|4[,.]9\s*\/\s*5)/.test(doc.body.textContent),
    'unverified performance/review claim',
  );
  pages.push({ path, title, h1: doc.querySelector('h1')?.textContent, images: doc.images.length });
  dom.window.close();
}
for (const [url, alternates] of alternatesByUrl) {
  for (const alternate of alternates) {
    if (!alternatesByUrl.get(alternate.href)?.some((link) => link.href === url))
      errors.push(`${url}: missing hreflang return link from ${alternate.href}`);
  }
}
sitemap.window.close();
let notFoundHtml;
if (liveOrigin) {
  const missing = await fetch(new URL('/finaltask-does-not-exist/', liveOrigin), {
    redirect: 'manual',
  });
  if (missing.status !== 404) errors.push(`Unknown URL HTTP ${missing.status}, expected 404`);
  notFoundHtml = await missing.text();
} else {
  notFoundHtml = await readFile(join(root, '404.html'), 'utf8');
}
const notFoundDom = new JSDOM(notFoundHtml);
checkAnalytics(notFoundDom.window.document, (condition, message) => {
  if (!condition) errors.push(`404: ${message}`);
});
if (
  !notFoundDom.window.document
    .querySelector('meta[name="robots"]')
    ?.content.split(/[\s,]+/)
    .includes('noindex')
)
  errors.push('404: expected noindex');
notFoundDom.window.close();
await mkdir('docs/qa', { recursive: true });
await writeFile(
  `docs/qa/${liveOrigin ? 'live' : 'local'}-routes.json`,
  JSON.stringify(
    { origin: liveOrigin ?? 'local production build', routes: pages.length, errors, pages },
    null,
    2,
  ) + '\n',
);
console.log(`${pages.length} routes + 404 audited; ${errors.length} errors`);
for (const error of errors) console.error(error);
process.exitCode = errors.length ? 1 : 0;
