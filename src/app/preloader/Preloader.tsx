import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { cn } from '@shared/lib';
import styles from './Preloader.module.scss';

/**
 * Branded loading overlay. Rendered into the prerendered HTML (no flash), then
 * faded out on the client via CSS. Deterministic timers (StrictMode-safe) drive
 * the fade and unmount — `pointer-events: none` is applied as it fades so it
 * never blocks interaction.
 */
export function Preloader() {
  const { t } = useTranslation();
  const [hidden, setHidden] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const fade = setTimeout(() => setHidden(true), 600);
    const remove = setTimeout(() => setDone(true), 1300);
    return () => {
      clearTimeout(fade);
      clearTimeout(remove);
    };
  }, []);

  if (done) return null;

  return (
    <div className={cn(styles.preloader, hidden && styles.hidden)} aria-hidden="true">
      <span className={styles.brand}>{t('brand')}</span>
    </div>
  );
}
