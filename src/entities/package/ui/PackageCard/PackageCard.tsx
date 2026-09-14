import type { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';

import { HOME_SECTIONS, homeSectionPath } from '@shared/config';
import { cn } from '@shared/lib';
import { AppLink, IconArrowRight } from '@shared/ui';

import type { Package } from '../../model/types';
import styles from './PackageCard.module.scss';

interface PackageCardProps {
  pkg: Package;
  /** Авторская визуализация, подобранная под характер пакета. */
  image: { src: string; position?: string };
}

/** Контрастная фотокарточка тарифа с быстрым переходом к расчёту. */
export function PackageCard({ pkg, image }: PackageCardProps) {
  const { t } = useTranslation();
  const name = t(`home.packages.items.${pkg.id}.name`);

  return (
    <article
      data-tone="dark"
      className={cn(styles.card, pkg.popular && styles.popular)}
      style={
        {
          '--card-photo': `url(${image.src})`,
          '--card-photo-pos': image.position ?? 'center',
        } as CSSProperties
      }
    >
      <div className={styles.topline}>
        <span className={styles.kind}>{t('home.packages.packageLabel')}</span>
        {pkg.popular && <span className={styles.badge}>{t('home.packages.popular')}</span>}
      </div>

      <div className={styles.body}>
        <header className={styles.head}>
          <h3 className={styles.name}>{name}</h3>
          <p className={styles.tagline}>{t(`home.packages.items.${pkg.id}.tagline`)}</p>
        </header>
        <p className={styles.price}>
          <span className={styles.priceFrom}>{t('home.packages.priceFrom')}</span>{' '}
          <span className={styles.priceValue}>{t(`home.packages.items.${pkg.id}.priceValue`)}</span>{' '}
          <span className={styles.priceUnit}>{t('home.packages.priceUnit')}</span>
        </p>

        <ul className={styles.features}>
          {pkg.featureKeys.map((key) => (
            <li key={key} className={styles.feature}>
              {t(`home.packages.features.${key}`)}
            </li>
          ))}
        </ul>

        <AppLink
          to={homeSectionPath(HOME_SECTIONS.calculator)}
          className={styles.cta}
          aria-label={`${t('home.packages.select')} ${name}`}
        >
          <span>{t('home.packages.select')}</span>
          <IconArrowRight aria-hidden="true" />
        </AppLink>
      </div>
    </article>
  );
}
