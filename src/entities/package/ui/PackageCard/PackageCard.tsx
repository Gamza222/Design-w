import type { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';

import { ROUTES } from '@shared/config';
import { cn } from '@shared/lib';
import { Button, IconArrowRight, IconCheck } from '@shared/ui';

import type { Package } from '../../model/types';
import styles from './PackageCard.module.scss';

interface PackageCardProps {
  pkg: Package;
  /** Интерьерное фото-фон карточки (по макету tariff-example.jpg). */
  image: { src: string; position?: string };
}

/** Карточка тарифа: светлая плита с интерьерным фото-фоном — слева кремовый скрим с текстом
 *  (название, цена, золотые галочки), справа проглядывает интерьер. Популярный — золотое кольцо
 *  и бейдж. Один CTA на карточку. */
export function PackageCard({ pkg, image }: PackageCardProps) {
  const { t } = useTranslation();

  return (
    <article
      className={cn(styles.card, pkg.popular && styles.popular)}
      style={
        {
          '--card-photo': `url(${image.src})`,
          '--card-photo-pos': image.position ?? 'center',
        } as CSSProperties
      }
    >
      {pkg.popular && <span className={styles.badge}>{t('home.packages.popular')}</span>}

      <div className={styles.body}>
        <header className={styles.head}>
          <h3 className={styles.name}>{t(`home.packages.items.${pkg.id}.name`)}</h3>
          <p className={styles.tagline}>{t(`home.packages.items.${pkg.id}.tagline`)}</p>
        </header>

        <p className={styles.price}>
          <span className={styles.priceFrom}>{t('home.packages.priceFrom')}</span>
          <span className={styles.priceValue}>{t(`home.packages.items.${pkg.id}.priceValue`)}</span>
          <span className={styles.priceUnit}>{t('home.packages.priceUnit')}</span>
        </p>

        <ul className={styles.features}>
          {pkg.featureKeys.map((key) => (
            <li key={key} className={styles.feature}>
              <IconCheck className={styles.check} strokeWidth={2} />
              <span>{t(`home.packages.features.${key}`)}</span>
            </li>
          ))}
        </ul>

        <Button
          to={ROUTES.contact}
          variant={pkg.popular ? 'primary' : 'ghost'}
          className={styles.cta}
        >
          <span className={styles.ctaLabel}>{t('home.packages.select')}</span>
          <span className={styles.ctaArrow} aria-hidden="true">
            <IconArrowRight />
          </span>
        </Button>
      </div>
    </article>
  );
}
