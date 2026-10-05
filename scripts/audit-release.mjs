// Audit every prerendered page, and optionally its published HTTP response.
// Usage: node scripts/audit-release.mjs [https://designseichas.ru]
import { readFile, stat, writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { JSDOM } from 'jsdom';

const root = join(process.cwd(), 'build/client');
const origin = 'https://designseichas.ru';
const liveOrigin = process.argv[2];
const sitemap = new JSDOM(await readFile(join(root, 'sitemap.xml'), 'utf8'), {
  contentType: 'text/xml',
});
const urls = [...sitemap.window.document.getElementsByTagName('loc')].map(
  (node) => node.textContent,
);
const errors = [];
const pages = [];
const titles = new Map();
const descriptions = new Map();
async function exists(path) {
  try {
    return (await stat(path)).isFile();
  } catch {
    return false;
  }
}

for (const url of urls) {
  const path = new URL(url).pathname;
  const check = (condition, message) => {
    if (!condition) errors.push(`${path}: ${message}`);
  };
  check(path.endsWith('/'), 'sitemap URL needs final slash');
  let html;
  if (liveOrigin) {
    const response = await fetch(new URL(path, liveOrigin));
    check(response.status === 200, `HTTP ${response.status}`);
    check(new URL(response.url).pathname === path, `unexpected redirect to ${response.url}`);
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
  const meta = (selector) => doc.querySelector(selector)?.getAttribute('content');
  const title = doc.title.trim();
  const description = meta('meta[name="description"]');
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
  const alternates = [...doc.querySelectorAll('link[hreflang]')];
  check(alternates.length === 4, 'expected RU/EN/BE/x-default alternates');
  for (const alternate of alternates)
    check(urls.includes(alternate.href), `missing alternate ${alternate.href}`);
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
if (liveOrigin) {
  const missing = await fetch(new URL('/finaltask-does-not-exist/', liveOrigin));
  if (missing.status !== 404) errors.push(`Unknown URL HTTP ${missing.status}, expected 404`);
}
await mkdir('docs/qa', { recursive: true });
await writeFile(
  `docs/qa/${liveOrigin ? 'live' : 'local'}-routes.json`,
  JSON.stringify(
    { origin: liveOrigin ?? 'local production build', routes: pages.length, errors, pages },
    null,
    2,
  ) + '\n',
);
console.log(`${pages.length} routes audited; ${errors.length} errors`);
for (const error of errors) console.error(error);
process.exitCode = errors.length ? 1 : 0;
