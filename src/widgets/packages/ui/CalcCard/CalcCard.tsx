import { useTranslation } from 'react-i18next';

import { ROUTES } from '@shared/config';
import { Button, IconCalculator } from '@shared/ui';

import styles from './CalcCard.module.scss';

/** Правый блок-действие ряда пакетов «Нужен расчёт?» (макет 01): на светлой панели — иконка-
 *  калькулятор, призыв и контурная кнопка «Рассчитать». Это не карточка, а контент на панели. */
export function CalcCard() {
  const { t } = useTranslation();

  return (
    <div className={styles.calc}>
      <IconCalculator className={styles.icon} />
      <h3 className={styles.title}>{t('home.packages.calc.title')}</h3>
      <p className={styles.text}>{t('home.packages.calc.description')}</p>
      <Button to={ROUTES.contact} variant="ghost" className={styles.cta}>
        {t('home.packages.calc.cta')}
      </Button>
    </div>
  );
}
