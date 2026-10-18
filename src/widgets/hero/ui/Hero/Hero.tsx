import { openLeadDialog } from '@shared/lib';
import { type ReactNode, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

import { HOME_SECTIONS, homeSectionPath } from '@shared/config';
import { cn } from '@shared/lib';
import { Button, Container, Image } from '@shared/ui';

import { heroImages } from '../../config/images';
import { HERO_BULLETS } from '../../lib/bullets';
import { HeroBenefits } from '../HeroBenefits/HeroBenefits';
import styles from './Hero.module.scss';

interface HeroProps {
  /** Нижняя полоса первого экрана (ряд пакетов), лежащая на фото Hero. Композиция — на уровне страницы. */
  bottomSlot?: ReactNode;
}

export function Hero({ bottomSlot }: HeroProps) {
  const { t } = useTranslation();
  const root = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  // Above-the-fold content is visible in prerendered HTML and during hydration.
  // Opacity entrances on H1 delayed LCP even after the image had loaded.

  // Parallax фона: фон-слой плавно сдвигается, пока секция проходит вьюпорт (scrub привязан к скроллу).
  // Нативный скролл, только transform. matchMedia также убирает движение, если пользователь
  // переключил reduced-motion во время просмотра, и адаптирует амплитуду при смене ширины.
  useGSAP(
    () => {
      if (!bgRef.current || !root.current) return;
      const media = gsap.matchMedia();
      media.add(
        {
          motion: '(prefers-reduced-motion: no-preference)',
          desktop: '(min-width: 1024px)',
        },
        (context) => {
          if (!context.conditions?.motion || !context.conditions.desktop) return;
          const travel = context.conditions.desktop ? 5 : 2;
          gsap.fromTo(
            bgRef.current,
            { yPercent: -travel, scale: 1.025 },
            {
              yPercent: travel,
              scale: 1.045,
              ease: 'none',
              force3D: true,
              scrollTrigger: {
                trigger: root.current,
                start: 'top top',
                end: 'bottom top',
                scrub: 0.65,
                invalidateOnRefresh: true,
              },
            },
          );

          const dust = root.current?.querySelector<HTMLElement>(`.${styles.dust}`);
          if (dust) {
            ScrollTrigger.create({
              trigger: root.current,
              start: 'top bottom',
              end: 'bottom top',
              onToggle: (self) => {
                dust.style.animationPlayState = self.isActive ? 'running' : 'paused';
              },
            });
          }
        },
      );
      return () => media.revert();
    },
    { scope: root },
  );

  return (
    <section className={styles.hero} ref={root} data-tone="dark" data-theme-fixed="dark">
      <div className={styles.bg} ref={bgRef} aria-hidden="true">
        <Image
          src={heroImages.background}
          alt=""
          priority
          sizes="100vw"
          className={styles.bgPhoto}
        />
      </div>
      {/* Золотая пыль в воздухе — медленный дрейф (декор, отключается reduced-motion). */}
      <span className={styles.dust} aria-hidden="true" />
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
              <Button onClick={() => openLeadDialog({ source: 'hero' })} size="lg">
                {t('cta.calculate')}
              </Button>
              <Button to={homeSectionPath(HOME_SECTIONS.portfolio)} variant="ghost" size="lg">
                {t('home.hero.ctaExamples')}
              </Button>
            </div>

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

        {bottomSlot && <div className={styles.bottom}>{bottomSlot}</div>}
      </Container>
    </section>
  );
}
