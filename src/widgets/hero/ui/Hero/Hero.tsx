import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

import { ROUTES } from '@shared/config';
import { cn } from '@shared/lib';
import { Button, Container } from '@shared/ui';

import styles from './Hero.module.scss';

export function Hero() {
  const { t } = useTranslation();
  const root = useRef<HTMLElement>(null);

  // useGSAP runs in a layout effect (before paint), so .from() hides the elements
  // before the first client paint — no flash. The prerendered HTML still contains
  // the text, so SEO and no-JS visitors are unaffected.
  useGSAP(
    () => {
      gsap.from(`.${styles.reveal}`, {
        y: 40,
        autoAlpha: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.12,
        delay: 0.9,
      });
    },
    { scope: root },
  );

  return (
    <section className={styles.hero} ref={root}>
      <Container className={styles.inner}>
        <span className={cn(styles.eyebrow, styles.reveal)}>{t('home.hero.eyebrow')}</span>
        <h1 className={cn(styles.title, styles.reveal)}>{t('home.hero.title')}</h1>
        <p className={cn(styles.subtitle, styles.reveal)}>{t('home.hero.subtitle')}</p>
        <div className={cn(styles.actions, styles.reveal)}>
          <Button to={ROUTES.contact}>{t('cta.request')}</Button>
          <Button to={ROUTES.portfolio} variant="ghost">
            {t('nav.portfolio')}
          </Button>
        </div>
      </Container>
    </section>
  );
}
