import type { Locale } from '@shared/config';

export const LOCALE_PREFERENCE_COOKIE = 'tdn_locale';

const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365;

/**
 * Remember an explicit language choice so Vercel's country redirect does not
 * override it on the visitor's next full-page request.
 */
export function saveLocalePreference(locale: Locale): void {
  if (typeof document === 'undefined') return;

  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${LOCALE_PREFERENCE_COOKIE}=${locale}; Path=/; Max-Age=${ONE_YEAR_IN_SECONDS}; SameSite=Lax${secure}`;
}
