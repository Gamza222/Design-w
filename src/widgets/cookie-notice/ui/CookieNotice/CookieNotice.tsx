import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ROUTES } from '@shared/config';
import { AppLink, Button } from '@shared/ui';

import styles from './CookieNotice.module.scss';

const STORAGE_KEY = 'tdn_cookie_notice_v1';

/** Informational notice for the locale cookie and the embedded Yandex map. */
export function CookieNotice() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      setVisible(window.localStorage.getItem(STORAGE_KEY) !== 'acknowledged');
    } catch {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  const acknowledge = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, 'acknowledged');
    } catch {
      // The notice still closes for this visit when storage is unavailable.
    }
    setVisible(false);
  };

  return (
    <aside className={styles.notice} data-tone="dark" aria-label={t('cookie.title')}>
      <div className={styles.copy}>
        <p className={styles.title}>{t('cookie.title')}</p>
        <p className={styles.text}>
          {t('cookie.text')}{' '}
          <AppLink to={ROUTES.privacy} className={styles.link}>
            {t('cookie.policy')}
          </AppLink>
        </p>
      </div>
      <Button type="button" size="sm" className={styles.button} onClick={acknowledge}>
        {t('cookie.acknowledge')}
      </Button>
    </aside>
  );
}
