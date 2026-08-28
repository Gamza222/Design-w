import { type CSSProperties, type ReactNode, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

import { HOME_SECTIONS, homeSectionPath } from '@shared/config';
import { cn, usePreloaderDone } from '@shared/lib';
import { Button, Container } from '@shared/ui';

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
  const preloaderDone = usePreloaderDone();

  // Флоу: сначала отыгрывает прелоадер, и только КОГДА шторка уходит (preloaderDone) — каскад Hero.
  // useGSAP — layout-эффект (до paint): пока шторка на экране, держим контент скрытым (под ней, без
  // вспышки), затем проигрываем появление. Prerendered HTML содержит текст → SEO/no-JS не страдают.
  useGSAP(
    () => {
      // Уважаем prefers-reduced-motion: без анимации prerendered-контент сразу видим и стабилен.
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      if (!preloaderDone) {
        gsap.set(`.${styles.reveal}`, { autoAlpha: 0, y: 36 });
        return;
      }
      gsap.fromTo(
        `.${styles.reveal}`,
        { autoAlpha: 0, y: 36 },
        { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.1 },
      );
    },
    { scope: root, dependencies: [preloaderDone] },
  );

  // Parallax фона: фон-слой плавно сдвигается, пока секция проходит вьюпорт (scrub привязан к скроллу).
  // Через ScrollTrigger напрямую (а не ScrollSmoother.effects), т.к. эффекты дочернего useGSAP
  // регистрируются раньше, чем родительский SmoothScroll создаёт смус. ScrollTrigger работает
  // поверх ScrollSmoother — движение остаётся плавным. transform-based (GPU). useGSAP чистит при анмаунте.
  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      if (!bgRef.current || !root.current) return;

      gsap.fromTo(
        bgRef.current,
        { yPercent: -7, scale: 1.035 },
        {
          yPercent: 7,
          scale: 1.085,
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

      // Дрейф пыли — infinite: ставим на паузу, когда Hero ушёл из вьюпорта,
      // чтобы компоситор не тикал весь остаток сессии.
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
              <Button to={homeSectionPath(HOME_SECTIONS.calculator)} size="lg">
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
