import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

import { usePreloaderDone } from '@shared/lib';
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
  const preloaderDone = usePreloaderDone();

  // Появление: панель — нижний крупный элемент первого экрана. Часть флоу «сначала прелоадер, потом
  // сайт»: всплывает, когда шторка уходит (preloaderDone), чуть позже текста Hero (delay 0.25).
  // Пока шторка на экране — держим скрытой (под ней). Reduced-motion — без анимации.
  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      if (!preloaderDone) {
        gsap.set(`.${styles.panel}`, { autoAlpha: 0, y: 32 });
        return;
      }
      gsap.fromTo(
        `.${styles.panel}`,
        { autoAlpha: 0, y: 32 },
        { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: 0.25 },
      );
    },
    { scope: root, dependencies: [preloaderDone] },
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
