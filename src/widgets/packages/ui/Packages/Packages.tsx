import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

import { usePreloaderDone } from '@shared/lib';
import { PACKAGES, PackageCard } from '@entities/package';

import { packageImages } from '../../config/images';
import { IntroCard } from '../IntroCard/IntroCard';
import styles from './Packages.module.scss';

/** Редакционная сетка тарифов: вводная карточка и три фотокарточки пакетов. */
export function Packages() {
  const root = useRef<HTMLDivElement>(null);
  const preloaderDone = usePreloaderDone();

  // Появление: панель — нижний крупный элемент первого экрана. Часть флоу «сначала прелоадер, потом
  // сайт»: всплывает, когда шторка уходит (preloaderDone), чуть позже текста Hero (delay 0.25).
  // Пока шторка на экране — держим скрытой (под ней). Reduced-motion — без анимации.
  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add('(prefers-reduced-motion: no-preference)', () => {
        if (!preloaderDone) {
          gsap.set(`.${styles.panel}`, { autoAlpha: 0, y: 32 });
          return;
        }
        gsap.fromTo(
          `.${styles.panel}`,
          { autoAlpha: 0, y: 32 },
          { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: 0.25 },
        );
      });
      return () => media.revert();
    },
    { scope: root, dependencies: [preloaderDone], revertOnUpdate: true },
  );

  return (
    <div className={styles.packages} ref={root}>
      <div className={styles.panel}>
        <div className={styles.row}>
          <IntroCard />
          {PACKAGES.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} image={packageImages[pkg.id]} />
          ))}
        </div>
      </div>
    </div>
  );
}
