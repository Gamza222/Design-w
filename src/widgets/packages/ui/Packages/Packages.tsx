import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

import { PACKAGES, PackageCard } from '@entities/package';
import { Container } from '@shared/ui';

import { packageImages } from '../../config/images';
import { CalcCard } from '../CalcCard/CalcCard';
import styles from './Packages.module.scss';

/** Секция «Пакеты» — светлая, чистый переход от тёмного Hero. Карточки-тарифы с интерьерным
 *  фото-фоном (макет tariff-example.jpg) + плита-калькулятор. Ряд шагает 4 → 2 → 1 (без «3 + 1»):
 *  узкие — 1, со средних — 2, на больших десктопах — 4. */
export function Packages() {
  const { t } = useTranslation();
  const root = useRef<HTMLElement>(null);

  // Появление по скроллу: шапка и карточки плавно всплывают. Уважаем prefers-reduced-motion.
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
        stagger: 0.12,
        scrollTrigger: { trigger: `.${styles.grid}`, start: 'top 85%', once: true },
      });
    },
    { scope: root },
  );

  return (
    <section className={styles.packages} ref={root} data-tone="light">
      <Container className={styles.inner}>
        <div className={styles.head}>
          <h2 className={styles.title}>{t('home.packages.title')}</h2>
          <p className={styles.description}>{t('home.packages.description')}</p>
        </div>

        <div className={styles.grid}>
          {PACKAGES.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} image={packageImages[pkg.id]} />
          ))}
          <CalcCard />
        </div>
      </Container>
    </section>
  );
}
