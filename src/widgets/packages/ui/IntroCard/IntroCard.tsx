import { useTranslation } from 'react-i18next';

import { openLeadDialog } from '@shared/lib';
import { Button, IconArrowRight, IconCalculator } from '@shared/ui';

import styles from './IntroCard.module.scss';

/** Вводная карточка: расчёт стоимости и пример полного проекта. */
export function IntroCard() {
  const { t } = useTranslation();

  return (
    <div className={styles.intro}>
      <div className={styles.copy}>
        <span className={styles.kicker}>{t('home.packages.kicker')}</span>
        <h2 className={styles.title}>{t('home.packages.title')}</h2>
        <p className={styles.text}>{t('home.packages.description')}</p>
      </div>
      <div className={styles.actions}>
        <Button
          onClick={() => openLeadDialog({ source: 'package-intro' })}
          className={styles.cta}
          size="sm"
        >
          <IconCalculator aria-hidden="true" />
          {t('home.packages.calc.cta')}
        </Button>
        <a
          className={styles.sample}
          href="/realimages/web/example-project.pdf"
          target="_blank"
          rel="noreferrer"
        >
          {t('home.packages.sampleProject')}
          <IconArrowRight aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
