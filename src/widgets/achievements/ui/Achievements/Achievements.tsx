import { useTranslation } from 'react-i18next';

import { HOME_SECTIONS, ROUTES } from '@shared/config';
import { useScrollReveal } from '@shared/lib';
import { AppLink, Container, IconArrowRight, SectionHeader } from '@shared/ui';

import { STAT_ICONS } from '../../lib/stats';
import styles from './Achievements.module.scss';

interface Principle {
  title: string;
  text: string;
}

/** The studio's approach, without unverified achievements or testimonials. */
export function Achievements() {
  const { t } = useTranslation();
  const items = t('home.achievements.items', { returnObjects: true }) as Principle[];
  const root = useScrollReveal<HTMLElement>([`.${styles.head}`, `.${styles.item}`]);

  return (
    <section id={HOME_SECTIONS.about} className={styles.achievements} ref={root} data-tone="light">
      <Container>
        <SectionHeader
          eyebrow={t('home.achievements.eyebrow')}
          title={t('home.achievements.title')}
          subtitle={t('home.achievements.subtitle')}
          className={styles.head}
        />
        <ul className={styles.grid}>
          {items.map((item, index) => {
            const Icon = STAT_ICONS[index] ?? STAT_ICONS[0];
            return (
              <li key={item.title} className={styles.item}>
                <Icon className={styles.icon} aria-hidden="true" />
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </li>
            );
          })}
        </ul>
        <AppLink to={ROUTES.about} className={styles.link}>
          {t('home.achievements.cta')}
          <IconArrowRight aria-hidden="true" />
        </AppLink>
      </Container>
    </section>
  );
}
