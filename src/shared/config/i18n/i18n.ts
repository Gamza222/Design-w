import { createInstance, type i18n as I18nInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';

import { DEFAULT_LOCALE, LOCALES, type Locale } from '../locales';
import en from './locales/en.json';
import be from './locales/be.json';
import ru from './locales/ru.json';

const resources = {
  ru: { translation: ru },
  en: { translation: en },
  be: { translation: be },
} as const;

export type Dictionary = typeof ru;

const dictionaries: Record<Locale, Dictionary> = { ru, en, be };

/** Raw translation object for a locale — for use outside React (e.g. route `meta`). */
export function getDict(locale: Locale): Dictionary {
  return dictionaries[locale];
}

/** Build a fully-initialised i18next instance for a given language. */
export function createI18n(lng: Locale): I18nInstance {
  const instance = createInstance();
  instance.use(initReactI18next).init({
    lng,
    fallbackLng: DEFAULT_LOCALE,
    supportedLngs: [...LOCALES],
    defaultNS: 'translation',
    resources,
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });
  return instance;
}

let clientInstance: I18nInstance | undefined;

/**
 * Fresh instance per render on the server (build-time prerender, where each
 * route may be a different locale); a reused singleton on the client.
 */
export function getI18n(lng: Locale): I18nInstance {
  if (import.meta.env.SSR) {
    return createI18n(lng);
  }
  if (!clientInstance) {
    clientInstance = createI18n(lng);
  }
  return clientInstance;
}
