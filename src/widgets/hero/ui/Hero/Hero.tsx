import { type CSSProperties, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

import { ROUTES } from '@shared/config';
import { cn } from '@shared/lib';
import { Button, Container } from '@shared/ui';

import { heroImages } from '../../config/images';
import { HERO_BULLETS } from '../../lib/bullets';
import { HeroBenefits } from '../HeroBenefits/HeroBenefits';
import styles from './Hero.module.scss';

export function Hero() {
  const { t } = useTranslation();
  const root = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  // useGSAP — layout-эффект (до paint): .from прячет элементы до первого клиентского
  // кадра, без вспышки. Prerendered HTML содержит текст → SEO/no-JS не страдают.
  // delay 0.9 держит хореографию: прелоадер → хедер (delay 0.7) → контент Hero.
  useGSAP(
    () => {
      // Уважаем prefers-reduced-motion: без анимации prerendered-контент сразу видим и стабилен.
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
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

  // Parallax фона: фон-слой плавно сдвигается, пока секция проходит вьюпорт (scrub привязан к скроллу).
  // Через ScrollTrigger напрямую (а не ScrollSmoother.effects), т.к. эффекты дочернего useGSAP
  // регистрируются раньше, чем родительский SmoothScroll создаёт смус. ScrollTrigger работает
  // поверх ScrollSmoother — движение остаётся плавным. transform-based (GPU). useGSAP чистит при анмаунте.
  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      gsap.fromTo(
        bgRef.current,
        { yPercent: -8 },
        {
          yPercent: 8,
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        },
      );
    },
    { scope: root },
  );

  return (
    <section
      className={styles.hero}
      ref={root}
      data-tone="dark"
      style={{ '--hero-bg': `url(${heroImages.background})` } as CSSProperties}
    >
      <div className={styles.bg} ref={bgRef} aria-hidden="true" />
      <Container className={styles.inner}>
        <div className={styles.grid}>
          <div className={styles.content}>
            <span className={cn(styles.eyebrow, styles.reveal)}>{t('home.hero.eyebrow')}</span>
            <h1 className={cn(styles.title, styles.reveal)}>
              {t('home.hero.titleLead')}{' '}
              <span className={styles.accent}>{t('home.hero.titleAccent')}</span>
            </h1>
            <p className={cn(styles.subtitle, styles.reveal)}>{t('home.hero.subtitle')}</p>

            <div className={cn(styles.actions, styles.reveal)}>
              <Button to={ROUTES.contact} size="lg">
                {t('cta.calculate')}
              </Button>
              <Button to={ROUTES.portfolio} variant="ghost" size="lg">
                {t('home.hero.ctaExamples')}
              </Button>
            </div>

            <hr className={cn(styles.divider, styles.reveal)} />

            <ul className={cn(styles.bullets, styles.reveal)}>
              {HERO_BULLETS.map(({ id, icon: Icon, labelKey }) => (
                <li key={id} className={styles.bullet}>
                  <Icon className={styles.bulletIcon} />
                  {t(labelKey)}
                </li>
              ))}
            </ul>
          </div>

          <HeroBenefits className={cn(styles.panel, styles.reveal)} />
        </div>
      </Container>
    </section>
  );
}
