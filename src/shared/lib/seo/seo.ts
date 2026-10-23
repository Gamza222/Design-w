import {
  getDict,
  getLocaleFromPath,
  canonicalPathname,
  CONTACTS,
  LOCALES,
  SITE_URL,
  localizePath,
  type Dictionary,
} from '../../config';

/** Minimal subset of React Router's meta args we rely on (keeps page modules
 * independent of generated `+types`, which a locale-shared route file can't emit). */
export interface RouteMetaArgs {
  location: { pathname: string };
  params: Record<string, string | undefined>;
}

/** Translation dictionary for the locale encoded in a pathname (for route `meta`). */
export function localeDict(pathname: string): Dictionary {
  return getDict(getLocaleFromPath(pathname));
}

/** Build a standard set of React Router meta descriptors (title, description, OG). */
export function buildMeta(
  title: string,
  description: string,
  pathname: string,
  options: { image?: string; imageAlt?: string; type?: 'website' | 'article' } = {},
) {
  const url = SITE_URL + canonicalPathname(pathname);
  const imagePath = options.image ?? '/realimages/web/about-poster.webp';
  const socialImage = imagePath.startsWith('https://') ? imagePath : `${SITE_URL}${imagePath}`;
  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:type', content: options.type ?? 'website' },
    { property: 'og:url', content: url },
    { property: 'og:image', content: socialImage },
    { property: 'og:image:alt', content: options.imageAlt ?? title },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:image', content: socialImage },
    { name: 'twitter:image:alt', content: options.imageAlt ?? title },
  ];
}

/** Название сайта едино для всех языковых версий на одном домене. */
export function buildHomeMeta(pathname: string) {
  const t = localeDict(pathname);
  const siteUrl = `${SITE_URL}/`;
  const organizationId = `${siteUrl}#organization`;
  const alternateName = ['ДизайнСейчас', 'Design Seichas'];

  return [
    ...buildMeta(t.home.seo.title, t.home.seo.description, pathname),
    {
      'script:ld+json': {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebSite',
            '@id': `${siteUrl}#website`,
            url: siteUrl,
            name: t.brand,
            alternateName,
            inLanguage: [...LOCALES],
            publisher: { '@id': organizationId },
          },
          buildOrganizationSchema(pathname),
        ],
      },
    },
  ];
}

/** Один реальный офис; дистанционная работа не превращается в вымышленные филиалы. */
export function buildOrganizationSchema(pathname: string) {
  const t = localeDict(pathname);
  return {
    '@type': ['Organization', 'LocalBusiness'],
    '@id': `${SITE_URL}/#organization`,
    url: `${SITE_URL}/`,
    name: t.brand,
    alternateName: ['ДизайнСейчас', 'Design Seichas'],
    description: t.about.subtitle,
    image: `${SITE_URL}/realimages/web/about-poster.webp`,
    email: CONTACTS.email,
    ...(CONTACTS.phone ? { telephone: CONTACTS.phone } : {}),
    ...(CONTACTS.address
      ? {
          address: {
            '@type': 'PostalAddress',
            streetAddress: CONTACTS.address.replace(/^Москва,\s*/, ''),
            addressLocality: 'Москва',
            addressCountry: 'RU',
          },
        }
      : {}),
    ...(CONTACTS.mapPoint ? { geo: { '@type': 'GeoCoordinates', ...CONTACTS.mapPoint } } : {}),
    areaServed: serviceAreas(),
    sameAs: CONTACTS.socials.map(({ href }) => href),
  };
}

function serviceAreas() {
  return [
    { '@type': 'City', name: 'Москва' },
    { '@type': 'Country', name: 'Россия' },
    { '@type': 'Country', name: 'Беларусь' },
  ];
}

/** Разметка отражает опубликованный состав услуги и видимые хлебные крошки. */
export function buildServiceSchema(pathname: string, name: string, description: string) {
  const t = localeDict(pathname);
  const locale = getLocaleFromPath(pathname);
  const url = SITE_URL + canonicalPathname(pathname);
  return {
    'script:ld+json': {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Service',
          '@id': `${url}#service`,
          url,
          name,
          description,
          serviceType: name,
          provider: { '@id': `${SITE_URL}/#organization` },
          areaServed: serviceAreas(),
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { name: t.nav.home, item: SITE_URL + localizePath('/', locale) },
            { name: t.nav.services, item: SITE_URL + localizePath('/services', locale) },
            { name, item: url },
          ].map((item, index) => ({ '@type': 'ListItem', position: index + 1, ...item })),
        },
      ],
    },
  };
}
