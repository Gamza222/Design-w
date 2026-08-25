import { useTranslation } from 'react-i18next';

import { DEFAULT_LOCALE, isLocale, type Locale } from '../../config/locales';

/** Current active locale, derived from the i18next instance (kept in sync with the URL). */
export function useLocale(): Locale {
  const { i18n } = useTranslation();
  return isLocale(i18n.language) ? i18n.language : DEFAULT_LOCALE;
}
