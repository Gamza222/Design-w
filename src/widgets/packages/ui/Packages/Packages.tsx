import { HOME_PACKAGES, PackageCard } from '@entities/package';

import { packageImages } from '../../config/images';
import { IntroCard } from '../IntroCard/IntroCard';
import styles from './Packages.module.scss';

/** Редакционная сетка тарифов: вводная карточка и три фотокарточки пакетов. */
export function Packages() {
  return (
    <div className={styles.packages}>
      <div className={styles.panel}>
        <div className={styles.row}>
          <IntroCard />
          {HOME_PACKAGES.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} image={packageImages[pkg.id]!} />
          ))}
        </div>
      </div>
    </div>
  );
}
