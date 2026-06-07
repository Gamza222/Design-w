// Pure (no React / no import.meta) route helpers — safe to import in Node
// (e.g. from react-router.config.ts prerender helper) and in the app.

import { DEFAULT_LOCALE, type Locale } from './locales';

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
} as const;

/** Static (non-content) page paths used to seed prerendering. */
export const STATIC_PATHS: readonly string[] = [
  ROUTES.home,
  ROUTES.services,
  ROUTES.portfolio,
  ROUTES.blog,
  ROUTES.about,
  ROUTES.contact,
];

/** Prefix a canonical path with a locale (default locale stays unprefixed). */
export function localizePath(path: string, locale: Locale): string {
  if (locale === DEFAULT_LOCALE) return path;
  return path === '/' ? `/${locale}` : `/${locale}${path}`;
}

/** Read the locale segment from a pathname (falls back to default). */
export function getLocaleFromPath(pathname: string): Locale {
  const seg = pathname.split('/')[1];
  return seg === 'en' ? 'en' : DEFAULT_LOCALE;
}

/** Remove the locale prefix, returning the canonical path. */
export function stripLocale(pathname: string): string {
  const stripped = pathname.replace(/^\/en(?=\/|$)/, '');
  return stripped === '' ? '/' : stripped;
}
