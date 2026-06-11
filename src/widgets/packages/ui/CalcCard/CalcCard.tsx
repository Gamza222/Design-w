import type { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';

import { ROUTES } from '@shared/config';
import { Button, IconArrowRight, IconCalculator } from '@shared/ui';

import { calcCardImage } from '../../config/images';
import styles from './CalcCard.module.scss';

/** Карточка-действие «Нужен расчёт?» — отдельная плита в ряду тарифов: интерьерное фото +
 *  тёмно-золотой оверлей, иконка-калькулятор и призыв рассчитать стоимость прямо на сайте. */
export function CalcCard() {
  const { t } = useTranslation();

  return (
    <article
      className={styles.card}
      style={{ '--calc-photo': `url(${calcCardImage})` } as CSSProperties}
    >
      <span className={styles.iconBadge}>
        <IconCalculator className={styles.icon} />
      </span>
      <h3 className={styles.title}>{t('home.packages.calc.title')}</h3>
      <p className={styles.description}>{t('home.packages.calc.description')}</p>
      <Button to={ROUTES.contact} className={styles.cta}>
        <span className={styles.ctaLabel}>{t('home.packages.calc.cta')}</span>
        <span className={styles.ctaArrow} aria-hidden="true">
          <IconArrowRight />
        </span>
      </Button>
    </article>
  );
}
