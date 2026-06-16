import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

import { PACKAGES, PackageCard } from '@entities/package';

import { packageImages } from '../../config/images';
import { CalcCard } from '../CalcCard/CalcCard';
import { IntroCard } from '../IntroCard/IntroCard';
import styles from './Packages.module.scss';

/** Ряд пакетов (макет 01) — светлая панель, наезжающая на фото Hero как нижняя полоса первого
 *  экрана: интро · СТАРТ · КОМФОРТ · ПОЛНЫЙ · «Нужен расчёт?». На больших (≥$bp-xxl) — сетка
 *  5-в-ряд (Hero держит 100vh); ниже — интро-шапка сверху + карточки 2×2; на телефонах — по 1 в ряд. */
export function Packages() {
  const root = useRef<HTMLDivElement>(null);

  // Появление: панель — самый нижний крупный элемент первого экрана, поэтому всплывает ПОСЛЕ каскада
  // контента Hero (.reveal: delay 0.9, stagger 0.12 → последний элемент ~1.6). Уважаем prefers-reduced-motion.
  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      gsap.from(`.${styles.panel}`, {
        y: 32,
        autoAlpha: 0,
        duration: 0.8,
        ease: 'power3.out',
        delay: 1.5,
      });
    },
    { scope: root },
  );

  return (
    <div className={styles.packages} ref={root}>
      <div className={styles.panel}>
        <div className={styles.row}>
          <IntroCard />
          {PACKAGES.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} image={packageImages[pkg.id]} />
          ))}
          <CalcCard />
        </div>
      </div>
    </div>
  );
}
