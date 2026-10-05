import {
  getDict,
  getLocaleFromPath,
  canonicalPathname,
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
