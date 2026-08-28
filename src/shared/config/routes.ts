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

/** Stable anchors on the single-page home experience. */
export const HOME_SECTIONS = {
  services: 'services',
  about: 'about',
  portfolio: 'portfolio',
  blog: 'blog',
  calculator: 'calculator',
  request: 'request',
  contacts: 'contacts',
} as const;

export type HomeSection = (typeof HOME_SECTIONS)[keyof typeof HOME_SECTIONS];

/** Canonical home URL with a section hash. Locale prefixing is handled by `AppLink`. */
export function homeSectionPath(section: HomeSection): string {
  return `/#${section}`;
}

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

  const suffixIndex = path.search(/[?#]/);
  const pathname = suffixIndex === -1 ? path : path.slice(0, suffixIndex);
  const suffix = suffixIndex === -1 ? '' : path.slice(suffixIndex);
  const prefix = LOCALE_PATHS[locale];
  const localized = pathname === '/' ? `/${prefix}` : `/${prefix}${pathname}`;
  return `${localized}${suffix}`;
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
