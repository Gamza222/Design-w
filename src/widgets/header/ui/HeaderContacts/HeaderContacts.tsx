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
      <span className={styles.hours}>{t('header.hours')}</span>
    </div>
  );
}
