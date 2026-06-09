import { useTranslation } from 'react-i18next';

import { ROUTES } from '@shared/config';
import { Button, IconCalculator } from '@shared/ui';

import styles from './CalcCard.module.scss';

/** Карточка-действие «Нужен расчёт?» — в одном ряду с пакетами: золотой чип-иконка + ghost-CTA. */
export function CalcCard() {
  const { t } = useTranslation();

  return (
    <article className={styles.card}>
      <span className={styles.iconBadge}>
        <IconCalculator className={styles.icon} />
      </span>
      <h3 className={styles.title}>{t('home.packages.calc.title')}</h3>
      <p className={styles.description}>{t('home.packages.calc.description')}</p>
      <Button to={ROUTES.contact} variant="ghost" className={styles.button}>
        {t('home.packages.calc.cta')}
      </Button>
    </article>
  );
}
