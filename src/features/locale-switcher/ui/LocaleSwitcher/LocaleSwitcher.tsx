import { useLocation, useNavigate } from 'react-router';

import {
  getLocaleFromPath,
  LOCALE_LABELS,
  LOCALES,
  localizePath,
  stripLocale,
} from '@shared/config';
import { cn } from '@shared/lib';

import styles from './LocaleSwitcher.module.scss';

/** RU/EN switch — navigates to the equivalent path in the chosen locale. */
export function LocaleSwitcher() {
  const { pathname, search, hash } = useLocation();
  const navigate = useNavigate();

  const current = getLocaleFromPath(pathname);
  const canonical = stripLocale(pathname);

  return (
    <div className={styles.switcher} role="group" aria-label="Language">
      {LOCALES.map((locale) => (
        <button
          key={locale}
          type="button"
          className={cn(styles.option, locale === current && styles.active)}
          aria-current={locale === current ? 'true' : undefined}
          onClick={() => navigate(localizePath(canonical, locale) + search + hash)}
        >
          {LOCALE_LABELS[locale]}
        </button>
      ))}
    </div>
  );
}
