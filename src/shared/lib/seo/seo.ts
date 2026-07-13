import {
  getDict,
  getLocaleFromPath,
  normalizePathname,
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
export function buildMeta(title: string, description: string, pathname: string) {
  // Нормализуем на случай URL с хвостовым слэшом — og:url должен совпадать с пререндером.
  const url = SITE_URL + normalizePathname(pathname);
  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: url },
  ];
}
