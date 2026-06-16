import { useTranslation } from 'react-i18next';

import { ROUTES } from '@shared/config';
import { Button } from '@shared/ui';

import styles from './IntroCard.module.scss';

/** Левый блок-интро ряда пакетов (макет 01): на светлой панели — заголовок секции, пояснение
 *  и золотая кнопка «Подобрать пакет». Это не карточка, а контент прямо на панели. */
export function IntroCard() {
  const { t } = useTranslation();

  return (
    <div className={styles.intro}>
      <div className={styles.copy}>
        <h2 className={styles.title}>{t('home.packages.title')}</h2>
        <p className={styles.text}>{t('home.packages.description')}</p>
      </div>
      <Button to={ROUTES.contact} className={styles.cta}>
        {t('home.packages.pick')}
      </Button>
    </div>
  );
}
