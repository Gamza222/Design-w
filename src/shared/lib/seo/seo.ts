import {
  getDict,
  getLocaleFromPath,
  canonicalPathname,
  CONTACTS,
  LOCALES,
  SITE_URL,
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
          {
            '@type': 'Organization',
            '@id': organizationId,
            url: siteUrl,
            name: t.brand,
            alternateName,
            description: t.home.seo.description,
            email: CONTACTS.email,
            ...(CONTACTS.phone ? { telephone: CONTACTS.phone } : {}),
            ...(CONTACTS.address ? { address: CONTACTS.address } : {}),
            sameAs: CONTACTS.socials.map(({ href }) => href),
          },
        ],
      },
    },
  ];
}
