import type { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';

import { cn } from '@shared/lib';

import type { Package } from '../../model/types';
import styles from './PackageCard.module.scss';

interface PackageCardProps {
  pkg: Package;
  /** Интерьерное фото тарифа (правая часть карточки, по макету 01). */
  image: { src: string; position?: string };
}

/** Компактная карточка тарифа (макет 01): слева на белом скриме — название, тёмная цена и
 *  буллеты-точки; справа проглядывает интерьерное фото. Популярный — золотой бейдж сверху. */
export function PackageCard({ pkg, image }: PackageCardProps) {
  const { t } = useTranslation();

  return (
    <article
      data-tone="paper"
      className={cn(styles.card, pkg.popular && styles.popular)}
      style={
        {
          '--card-photo': `url(${image.src})`,
          '--card-photo-pos': image.position ?? 'center',
        } as CSSProperties
      }
    >
      {pkg.popular && <span className={styles.badge}>{t('home.packages.popular')}</span>}

      <header className={styles.head}>
        <h3 className={styles.name}>{t(`home.packages.items.${pkg.id}.name`)}</h3>
        <p className={styles.price}>
          <span className={styles.priceFrom}>{t('home.packages.priceFrom')}</span>{' '}
          <span className={styles.priceValue}>{t(`home.packages.items.${pkg.id}.priceValue`)}</span>{' '}
          <span className={styles.priceUnit}>{t('home.packages.priceUnit')}</span>
        </p>
      </header>

      <ul className={styles.features}>
        {pkg.featureKeys.map((key) => (
          <li key={key} className={styles.feature}>
            {t(`home.packages.features.${key}`)}
          </li>
        ))}
      </ul>
    </article>
  );
}
