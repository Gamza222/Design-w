import { useTranslation } from 'react-i18next';

import { CONTACTS } from '@shared/config';

import styles from './HeaderContacts.module.scss';

/** Телефон и часы работы со статус-точкой. Телефон — из конфига, часы — из i18n. */
export function HeaderContacts() {
  const { t } = useTranslation();

  return (
    <div className={styles.contacts}>
      {CONTACTS.phone != null && CONTACTS.phoneHref != null && (
        <a className={styles.phone} href={CONTACTS.phoneHref}>
          {CONTACTS.phone}
        </a>
      )}
      <span className={styles.hours}>
        <span className={styles.dot} role="img" aria-label={t('header.online')} />
        {t('header.hours')}
      </span>
    </div>
  );
}
