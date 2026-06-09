import { useTranslation } from 'react-i18next';

import { cn } from '@shared/lib';
import { IconCheck, Image } from '@shared/ui';

import type { Package } from '../../model/types';
import styles from './PackageCard.module.scss';

interface PackageCardProps {
  pkg: Package;
}

/** Карточка пакета: текст (название, цена, фичи) слева, фото справа, опц. бейдж «Популярный». */
export function PackageCard({ pkg }: PackageCardProps) {
  const { t } = useTranslation();

  return (
    <article className={cn(styles.card, pkg.popular && styles.popular)}>
      {pkg.popular && <span className={styles.badge}>{t('home.packages.popular')}</span>}

      <div className={styles.text}>
        <div className={styles.head}>
          <h3 className={styles.name}>{t(`home.packages.items.${pkg.id}.name`)}</h3>
          <p className={styles.price}>{t(`home.packages.items.${pkg.id}.price`)}</p>
        </div>

        <ul className={styles.features}>
          {pkg.featureKeys.map((key) => (
            <li key={key} className={styles.feature}>
              <IconCheck className={styles.check} />
              {t(`home.packages.features.${key}`)}
            </li>
          ))}
        </ul>
      </div>

      {pkg.image && (
        <div className={styles.media}>
          <Image src={pkg.image} alt="" className={styles.mediaImg} />
        </div>
      )}
    </article>
  );
}
