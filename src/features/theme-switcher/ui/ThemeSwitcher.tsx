import { useSyncExternalStore } from 'react';
import { useTranslation } from 'react-i18next';
import { FiMoon, FiSun } from 'react-icons/fi';

import styles from './ThemeSwitcher.module.scss';

const EVENT = 'designseichas:theme';
function subscribe(notify: () => void) {
  window.addEventListener(EVENT, notify);
  window.addEventListener('storage', notify);
  return () => {
    window.removeEventListener(EVENT, notify);
    window.removeEventListener('storage', notify);
  };
}
function getTheme() {
  return document.documentElement.dataset.theme === 'light';
}

export function ThemeSwitcher() {
  const { i18n } = useTranslation();
  const light = useSyncExternalStore(subscribe, getTheme, () => false);
  const locale = i18n.resolvedLanguage ?? i18n.language;
  const label = locale === 'en' ? 'Light theme' : locale === 'be' ? 'Светлая тэма' : 'Светлая тема';
  return (
    <button
      className={styles.button}
      type="button"
      aria-label={label}
      aria-pressed={light}
      onClick={() => {
        const theme = light ? 'dark' : 'light';
        document.documentElement.dataset.theme = theme;
        try {
          localStorage.setItem('designseichas-theme', theme);
        } catch {
          /* Theme still works when storage is unavailable. */
        }
        window.dispatchEvent(new Event(EVENT));
      }}
    >
      {light ? <FiMoon aria-hidden="true" /> : <FiSun aria-hidden="true" />}
    </button>
  );
}
