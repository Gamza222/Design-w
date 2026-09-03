import { useTranslation } from 'react-i18next';

import { HOME_SECTIONS, homeSectionPath } from '@shared/config';
import { Button, IconCalculator } from '@shared/ui';

import styles from './CalcCard.module.scss';

/** Правый блок-действие ряда пакетов «Нужен расчёт?» (макет 01): на светлой панели — иконка-
 *  калькулятор, призыв и контурная кнопка «Рассчитать». Это не карточка, а контент на панели. */
export function CalcCard() {
  const { t } = useTranslation();

  return (
    <div className={styles.calc} data-tone="paper">
      <IconCalculator className={styles.icon} />
      <h3 className={styles.title}>{t('home.packages.calc.title')}</h3>
      <p className={styles.text}>{t('home.packages.calc.description')}</p>
      <Button
        to={homeSectionPath(HOME_SECTIONS.calculator)}
        variant="ghost"
        className={styles.cta}
      >
        {t('home.packages.calc.cta')}
      </Button>
    </div>
  );
}
