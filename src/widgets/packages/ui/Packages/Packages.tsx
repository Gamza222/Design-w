import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

import { PACKAGES, PackageCard } from '@entities/package';
import { ROUTES } from '@shared/config';
import { Button, Container } from '@shared/ui';

import { CalcCard } from '../CalcCard/CalcCard';
import styles from './Packages.module.scss';

/** Секция «Пакеты дизайн-проекта» — светлая (чистый переход от тёмного Hero).
 *  Шапка сверху (текст + CTA), карточки в ряд; всё всплывает по скроллу. */
export function Packages() {
  const { t } = useTranslation();
  const root = useRef<HTMLElement>(null);

  // Появление по скроллу-в-вид: на первом экране секции не видно, при скролле она
  // плавно всплывает. Уважаем prefers-reduced-motion (контент сразу видим и стабилен).
  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      gsap.from(`.${styles.head} > *`, {
        y: 28,
        autoAlpha: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: { trigger: root.current, start: 'top 80%', once: true },
      });
      gsap.from(`.${styles.grid} > *`, {
        y: 32,
        autoAlpha: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: { trigger: `.${styles.grid}`, start: 'top 85%', once: true },
      });
    },
    { scope: root },
  );

  return (
    <section className={styles.packages} ref={root} data-tone="light">
      <Container>
        <div className={styles.head}>
          <div className={styles.headText}>
            <h2 className={styles.title}>{t('home.packages.title')}</h2>
            <p className={styles.description}>{t('home.packages.description')}</p>
          </div>
          <Button to={ROUTES.contact} size="lg" className={styles.cta}>
            {t('home.packages.cta')}
          </Button>
        </div>

        <div className={styles.grid}>
          {PACKAGES.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
          <CalcCard />
        </div>
      </Container>
    </section>
  );
}
