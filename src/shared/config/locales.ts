// Single source of truth for supported languages.
// Add a new language here + a matching JSON in i18n/locales + content/<type>/<lang>/.

export const LOCALES = ['ru', 'en', 'be'] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'ru';

export const LOCALE_LABELS: Record<Locale, string> = {
  ru: 'RU',
  en: 'EN',
  be: 'BY',
};

/** URL-сегменты отделены от кодов языка: белорусская витрина живёт на понятном `/by`,
 *  а i18n и `html[lang]` используют корректный языковой код `be`. */
export const LOCALE_PATHS: Record<Locale, string> = {
  ru: '',
  en: 'en',
  be: 'by',
};

export const LOCALE_HREFLANGS: Record<Locale, string> = {
  ru: 'ru-RU',
  en: 'en',
  be: 'be-BY',
};

export function isLocale(value: string | undefined): value is Locale {
  return value !== undefined && (LOCALES as readonly string[]).includes(value);
}
