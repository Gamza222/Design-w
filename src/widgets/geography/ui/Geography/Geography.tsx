import { type ComponentType, type SVGProps, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

import { ROUTES } from '@shared/config';
import { cn } from '@shared/lib';
import {
  AppLink,
  Button,
  Container,
  IconArrowRight,
  IconChat,
  IconClipboardCheck,
  IconClock,
  IconFolderCheck,
  IconGlobe,
  IconMapPin,
  IconRuble,
  SectionHeader,
  Stat,
} from '@shared/ui';

import { CITIES, type City } from '../../config/cities';
import { caseImage } from '../../config/images';
import { RUSSIA_MAP_PATH, RUSSIA_MAP_TRANSFORM, RUSSIA_MAP_VIEWBOX } from '../../config/russia-map';
import styles from './Geography.module.scss';

type Icon = ComponentType<SVGProps<SVGSVGElement>>;

interface GeoStat {
  value: string;
  label: string;
}
interface HowStep {
  title: string;
  desc: string;
}

const STAT_ICONS: Icon[] = [IconMapPin, IconClock, IconChat, IconRuble];
const HOW_ICONS: Icon[] = [IconFolderCheck, IconChat, IconClipboardCheck];

const HUB = CITIES.find((c) => c.hub) ?? CITIES[0];
const SPOKES = CITIES.filter((c) => !c.hub);
// Самолётики — на длинных восточных маршрутах (чтобы не перегружать запад карты).
const PLANE_ON = new Set(['ekb', 'nsk', 'vlk']);
// Ключевые города, чьи подписи видны и на мобильной карте (остальные — только точки:
// при ширине ~320px все девять подписей нечитаемы и слипаются).
const MOBILE_LABELS = new Set(['moscow', 'spb', 'nsk', 'vlk']);

/** Точка квадратичной кривой Безье в параметре t. */
function quadPoint(p0: City, cx: number, cy: number, p1: City, t: number) {
  const u = 1 - t;
  return {
    x: u * u * p0.x + 2 * u * t * cx + t * t * p1.x,
    y: u * u * p0.y + 2 * u * t * cy + t * t * p1.y,
  };
}

/** Угол касательной квадратичной кривой в t (градусы) — для разворота самолётика. */
function quadAngle(p0: City, cx: number, cy: number, p1: City, t: number) {
  const u = 1 - t;
  const dx = 2 * u * (cx - p0.x) + 2 * t * (p1.x - cx);
  const dy = 2 * u * (cy - p0.y) + 2 * t * (p1.y - cy);
  return (Math.atan2(dy, dx) * 180) / Math.PI;
}

/** Секция «География» (tone=dark, макет 06) — карта РФ с маршрутами из Москвы и самолётиками,
 *  карточки «работаем из любой точки» и кейса, ряд статов, «как работает онлайн» и CTA. */
export function Geography() {
  const { t } = useTranslation();
  const root = useRef<HTMLElement>(null);
  const stats = t('home.geography.stats', { returnObjects: true }) as GeoStat[];
  const howSteps = t('home.geography.howSteps', { returnObjects: true }) as HowStep[];

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      // Шапка + карточки-оверлеи карты всплывают, когда сцена входит во вьюпорт.
      gsap.from(`.${styles.head}, .${styles.remoteCard}, .${styles.caseCard}`, {
        y: 24,
        autoAlpha: 0,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: { trigger: `.${styles.stage}`, start: 'top 80%', once: true },
      });
      gsap.from(`.${styles.node}`, {
        scale: 0,
        autoAlpha: 0,
        transformOrigin: 'center',
        duration: 0.5,
        ease: 'back.out(2)',
        stagger: 0.08,
        scrollTrigger: { trigger: `.${styles.stage}`, start: 'top 75%', once: true },
      });
      gsap.from(`.${styles.statItem}, .${styles.howStep}, .${styles.ctaCard}`, {
        y: 24,
        autoAlpha: 0,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: { trigger: `.${styles.stats}`, start: 'top 88%', once: true },
      });
    },
    { scope: root },
  );

  return (
    <section className={styles.geography} ref={root} data-tone="dark">
      <Container className={styles.inner}>
        {/* Сцена: ≥lg — заголовок слева, карта справа (мокап 06); ниже — стопкой */}
        <div className={styles.stage}>
          <SectionHeader
            eyebrow={t('home.geography.eyebrow')}
            title={t('home.geography.title')}
            subtitle={t('home.geography.subtitle')}
            className={styles.head}
          />

          <div className={styles.mapWrap}>
            <svg
              className={styles.map}
              viewBox={RUSSIA_MAP_VIEWBOX}
              preserveAspectRatio="xMidYMid meet"
              role="img"
              aria-label={t('home.geography.title')}
            >
              <defs>
                <radialGradient id="geoLand" cx="38%" cy="42%" r="85%">
                  <stop offset="0%" stopColor="color-mix(in srgb, var(--clr-light) 24%, var(--clr-dark-surface))" />
                  <stop offset="100%" stopColor="color-mix(in srgb, var(--clr-light) 13%, var(--clr-dark-surface))" />
                </radialGradient>
                <filter id="geoGlow" x="-200%" y="-200%" width="500%" height="500%">
                  <feGaussianBlur stdDeviation="6" />
                </filter>
              </defs>

              {/* Силуэт РФ */}
              <g transform={RUSSIA_MAP_TRANSFORM}>
                <path d={RUSSIA_MAP_PATH} className={styles.land} fill="url(#geoLand)" />
              </g>

              {/* Маршруты из Москвы */}
              <g>
                {SPOKES.map((city) => {
                  const cx = (HUB.x + city.x) / 2;
                  const cy = (HUB.y + city.y) / 2 - Math.min(140, Math.hypot(city.x - HUB.x, city.y - HUB.y) * 0.32);
                  const d = `M${HUB.x} ${HUB.y} Q ${cx} ${cy} ${city.x} ${city.y}`;
                  const showPlane = PLANE_ON.has(city.id);
                  const p = showPlane ? quadPoint(HUB, cx, cy, city, 0.55) : null;
                  const a = showPlane ? quadAngle(HUB, cx, cy, city, 0.55) : 0;
                  return (
                    <g key={city.id}>
                      <path d={d} className={styles.arc} />
                      {showPlane && p && (
                        <path
                          d="M-7 -4 L8 0 L-7 4 L-3.5 0 Z"
                          className={styles.plane}
                          transform={`translate(${p.x} ${p.y}) rotate(${a}) scale(1.5)`}
                        />
                      )}
                    </g>
                  );
                })}
              </g>

              {/* Города */}
              <g>
                {CITIES.map((city) => (
                  <g key={city.id} className={styles.node}>
                    <circle cx={city.x} cy={city.y} r={city.hub ? 16 : 11} className={styles.nodeGlow} filter="url(#geoGlow)" />
                    {city.hub && <circle cx={city.x} cy={city.y} r={11} className={styles.nodeRing} />}
                    <circle cx={city.x} cy={city.y} r={city.hub ? 5.5 : 4} className={styles.nodeDot} />
                    <text
                      x={city.anchorEnd ? city.x - 10 : city.x + 10}
                      y={city.y + 5}
                      textAnchor={city.anchorEnd ? 'end' : 'start'}
                      className={cn(styles.label, MOBILE_LABELS.has(city.id) && styles.labelMajor)}
                    >
                      {t(`home.geography.cities.${city.id}`)}
                    </text>
                  </g>
                ))}
              </g>
            </svg>

            <div className={styles.overlays}>
            {/* Карточка «работаем из любой точки» */}
            <div className={styles.remoteCard}>
              <span className={styles.remoteIcon} aria-hidden="true">
                <IconGlobe />
              </span>
              <div>
                <p className={styles.remoteTitle}>{t('home.geography.remoteTitle')}</p>
                <p className={styles.remoteText}>{t('home.geography.remoteText')}</p>
              </div>
            </div>

            {/* Карточка кейса */}
            <article className={styles.caseCard}>
              <div
                className={styles.casePhoto}
                style={{ backgroundImage: `url(${caseImage})` }}
                aria-hidden="true"
              />
              <div className={styles.caseBody}>
                <p className={styles.caseLabel}>{t('home.geography.caseLabel')}</p>
                <p className={styles.caseTitle}>{t('home.geography.caseTitle')}</p>
                <p className={styles.caseCity}>
                  <IconMapPin aria-hidden="true" /> {t('home.geography.caseCity')}
                </p>
                <AppLink to={ROUTES.portfolio} className={styles.caseCta}>
                  <span>{t('home.geography.caseCta')}</span>
                  <IconArrowRight aria-hidden="true" />
                </AppLink>
              </div>
            </article>
            </div>
          </div>
        </div>

        {/* Статы */}
        <ul className={styles.stats}>
          {stats.map((stat, i) => (
            <li key={stat.value} className={styles.statItem}>
              <Stat
                value={stat.value}
                label={stat.label}
                icon={(() => {
                  const Icon = STAT_ICONS[i] ?? STAT_ICONS[0];
                  return <Icon />;
                })()}
              />
            </li>
          ))}
        </ul>

        {/* Как работает онлайн + CTA */}
        <div className={styles.bottom}>
          <div className={styles.how}>
            <h3 className={styles.howTitle}>{t('home.geography.howTitle')}</h3>
            <ol className={styles.howList}>
              {howSteps.map((step, i) => {
                const Icon = HOW_ICONS[i] ?? HOW_ICONS[0];
                return (
                  <li key={step.title} className={styles.howStep}>
                    <span className={styles.howNum}>{String(i + 1).padStart(2, '0')}</span>
                    <span className={styles.howIcon} aria-hidden="true">
                      <Icon />
                    </span>
                    <p className={styles.howStepTitle}>{step.title}</p>
                    <p className={styles.howStepDesc}>{step.desc}</p>
                  </li>
                );
              })}
            </ol>
          </div>

          <div className={styles.ctaCard}>
            <h3 className={styles.ctaTitle}>{t('home.geography.ctaTitle')}</h3>
            <p className={styles.ctaText}>{t('home.geography.ctaText')}</p>
            <Button to={ROUTES.contact} size="lg" className={styles.ctaBtn}>
              {t('home.geography.cta')}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
