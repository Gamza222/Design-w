import { useTranslation } from 'react-i18next';

import { cn, openLeadDialog, useLocale } from '@shared/lib';
import { IconArrowRight, Image } from '@shared/ui';

import type { Package } from '../../model/types';
import { getTariff } from '../../model/tariffs';
import styles from './PackageCard.module.scss';

interface PackageCardProps {
  pkg: Package;
  /** Авторская визуализация, подобранная под характер пакета. */
  image: { src: string; position?: string };
}

/** Контрастная фотокарточка тарифа с быстрым переходом к расчёту. */
export function PackageCard({ pkg, image }: PackageCardProps) {
  const { t } = useTranslation();
  const tariff = getTariff(pkg.id, useLocale());
  const name = tariff.name;

  return (
    <article data-tone="dark" className={cn(styles.card, pkg.popular && styles.popular)}>
      <Image
        src={image.src}
        alt=""
        className={styles.photo}
        sizes="(max-width: 479px) 100vw, (max-width: 1279px) 50vw, 25vw"
        style={{ objectPosition: image.position ?? 'center' }}
      />
      <div className={styles.topline}>
        <span className={styles.kind}>{t('home.packages.packageLabel')}</span>
        {pkg.popular && <span className={styles.badge}>{t('home.packages.popular')}</span>}
      </div>

      <div className={styles.body}>
        <header className={styles.head}>
          <h3 className={styles.name}>{name}</h3>
          <p className={styles.tagline}>{tariff.description}</p>
        </header>
        <p className={styles.price}>
          <span className={styles.priceValue}>{tariff.priceLabel}</span>
        </p>

        <ul className={styles.features}>
          {tariff.summary.map((key) => (
            <li key={key} className={styles.feature}>
              {key}
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() =>
            openLeadDialog({
              source: 'package-card',
              service: name,
              packageId: pkg.id,
              packageName: name,
              currency: tariff.currency,
            })
          }
          className={styles.cta}
          aria-label={`${t('home.packages.select')} ${name}`}
        >
          <span>{t('home.packages.select')}</span>
          <IconArrowRight aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}
