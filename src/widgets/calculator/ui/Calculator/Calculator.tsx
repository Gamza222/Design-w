import { useTranslation } from 'react-i18next';

import { ProjectCalculator } from '@features/project-calculator';
import { useScrollReveal } from '@shared/lib';
import { Container, SectionHeader } from '@shared/ui';

import styles from './Calculator.module.scss';

/** Секция «Рассчитайте проект под вашу квартиру» (tone=dark, макет 09) — шапка + интерактивный
 *  калькулятор (формат → доп.услуги → площадь → live-итог). Контент — i18n `home.calculator`. */
export function Calculator() {
  const { t } = useTranslation();

  // Появление шапки и калькулятора по скроллу (общий хук).
  const root = useScrollReveal<HTMLElement>([`.${styles.inner} > *`], { stagger: 0.12 });

  return (
    <section className={styles.calculator} data-tone="dark" ref={root}>
      <Container className={styles.inner}>
        <SectionHeader
          eyebrow={t('home.calculator.eyebrow')}
          title={t('home.calculator.title')}
          subtitle={t('home.calculator.subtitle')}
          className={styles.head}
        />
        <ProjectCalculator />
      </Container>
    </section>
  );
}
