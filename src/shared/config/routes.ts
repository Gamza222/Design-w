// Pure (no React / no import.meta) route helpers — safe to import in Node
// (e.g. from react-router.config.ts prerender helper) and in the app.

import { DEFAULT_LOCALE, LOCALES, LOCALE_PATHS, type Locale } from './locales';

/** Canonical, locale-agnostic paths (the default-locale URLs). */
export const ROUTES = {
  home: '/',
  services: '/services',
  portfolio: '/portfolio',
  project: (slug: string) => `/portfolio/${slug}`,
  blog: '/blog',
  post: (slug: string) => `/blog/${slug}`,
  about: '/about',
  contact: '/contact',
  privacy: '/privacy',
  offer: '/offer',
  requisites: '/requisites',
  consent: '/consent',
} as const;

/** SEO-посадки услуг: корневые литеральные пути (одинаковы в обеих локалях).
 *  Контент страниц — i18n `servicePages.*`; сами роуты объявлены в `app/routes.ts`. */
export const SERVICE_LANDINGS = {
  planirovka: '/planirovka-kvartiry',
  viz3d: '/3d-vizualizaciya-interera',
  sketch: '/eskiznyj-dizajn-proekt',
} as const;

export type ServiceLandingKey = keyof typeof SERVICE_LANDINGS;

/** Static (non-content) page paths used to seed prerendering. */
export const STATIC_PATHS: readonly string[] = [
  ROUTES.home,
  ROUTES.services,
  ROUTES.portfolio,
  ROUTES.blog,
  ROUTES.about,
  ROUTES.contact,
  ROUTES.privacy,
  ROUTES.offer,
  ROUTES.requisites,
  ROUTES.consent,
  ...Object.values(SERVICE_LANDINGS),
];

/** Убираем хвостовой слэш (кроме корня). Статические хосты отдают одну страницу и по
 *  `/services`, и по `/services/`, а HTML пререндерен для пути без слэша — нормализация
 *  держит `lang`/canonical/og:url одинаковыми на сервере и клиенте (иначе hydration mismatch). */
export function normalizePathname(pathname: string): string {
  const trimmed = pathname.replace(/\/+$/, '');
  return trimmed === '' ? '/' : trimmed;
}

/** Prefix a canonical path with a locale (default locale stays unprefixed). */
export function localizePath(path: string, locale: Locale): string {
  if (locale === DEFAULT_LOCALE) return path;
  const prefix = LOCALE_PATHS[locale];
  return path === '/' ? `/${prefix}` : `/${prefix}${path}`;
}

/** Read the locale segment from a pathname (falls back to default). */
export function getLocaleFromPath(pathname: string): Locale {
  const seg = pathname.split('/')[1];
  return LOCALES.find((locale) => LOCALE_PATHS[locale] === seg) ?? DEFAULT_LOCALE;
}

/** Remove the locale prefix, returning the canonical path. */
export function stripLocale(pathname: string): string {
  const prefixes = LOCALES.map((locale) => LOCALE_PATHS[locale]).filter(Boolean);
  const stripped = pathname.replace(new RegExp(`^/(?:${prefixes.join('|')})(?=/|$)`), '');
  return stripped === '' ? '/' : stripped;
}
