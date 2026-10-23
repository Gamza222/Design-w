import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ROUTES } from '@shared/config';
import { AppLink, Button } from '@shared/ui';

import styles from './CookieNotice.module.scss';

const STORAGE_KEY = 'tdn_cookie_notice_v2';

/** Информационное уведомление о cookie, Google Analytics, Метрике и встроенной карте. */
export function CookieNotice() {
  const { t } = useTranslation();
  // Render the notice in the initial HTML. The head script and CSS hide it before
  // paint for returning visitors, without changing React's hydration markup.
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const acknowledge = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, 'acknowledged');
    } catch {
      // The notice still closes for this visit when storage is unavailable.
    }
    document.documentElement.dataset.cookieNotice = 'acknowledged';
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
