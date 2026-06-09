import { useTranslation } from 'react-i18next';

import { ROUTES } from '@shared/config';
import { Button, IconCalculator } from '@shared/ui';

import styles from './CalcCard.module.scss';

/** Карточка «Нужен расчёт?» — иконка калькулятора + кнопка перехода к расчёту. */
export function CalcCard() {
  const { t } = useTranslation();

  return (
    <article className={styles.card}>
      <IconCalculator className={styles.icon} />
      <h3 className={styles.title}>{t('home.packages.calc.title')}</h3>
      <p className={styles.description}>{t('home.packages.calc.description')}</p>
      <Button to={ROUTES.contact} variant="ghost" className={styles.button}>
        {t('home.packages.calc.cta')}
      </Button>
    </article>
  );
}
