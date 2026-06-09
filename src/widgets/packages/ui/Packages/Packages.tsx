import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

import { PACKAGES, PackageCard } from '@entities/package';
import { ROUTES } from '@shared/config';
import { Button, Container } from '@shared/ui';

import { CalcCard } from '../CalcCard/CalcCard';
import styles from './Packages.module.scss';

/** Секция «Пакеты дизайн-проекта» — светлая карточка, наезжающая на низ Hero. */
export function Packages() {
  const { t } = useTranslation();
  const root = useRef<HTMLElement>(null);

  // Появление на маунте (без ScrollTrigger): prerendered HTML содержит текст,
  // autoAlpha:0 до paint → без вспышки. См. подход в Hero.
  useGSAP(
    () => {
      // Уважаем prefers-reduced-motion: без анимации контент сразу видим и стабилен.
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      gsap.from(`.${styles.head}`, { y: 32, autoAlpha: 0, duration: 0.8, ease: 'power3.out' });
      gsap.from(`.${styles.grid} > *`, {
        y: 32,
        autoAlpha: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.08,
      });
    },
    { scope: root },
  );

  return (
    <section className={styles.packages} ref={root}>
      <Container className={styles.inner}>
        <div className={styles.card} data-tone="dark">
          <div className={styles.head}>
            <h2 className={styles.title}>{t('home.packages.title')}</h2>
            <p className={styles.description}>{t('home.packages.description')}</p>
            <Button to={ROUTES.contact} className={styles.cta}>
              {t('home.packages.cta')}
            </Button>
          </div>

          <div className={styles.grid}>
            {PACKAGES.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
            <CalcCard />
          </div>
        </div>
      </Container>
    </section>
  );
}
