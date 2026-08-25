import type { Locale } from '../../config/locales';

const BCP47: Record<Locale, string> = { ru: 'ru-RU', en: 'en-US', be: 'be-BY' };

/** Format an ISO date for display in the given locale. */
export function formatDate(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(BCP47[locale], {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(iso));
}
