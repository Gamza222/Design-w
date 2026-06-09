import { useTranslation } from 'react-i18next';

import { cn } from '@shared/lib';
import { IconCheck } from '@shared/ui';

import type { Package } from '../../model/types';
import styles from './PackageCard.module.scss';

interface PackageCardProps {
  pkg: Package;
}

/** Компактная карточка пакета для ленты: название, цена, чек-лист фич.
 *  Популярный — тёмная инверсия (data-tone="dark") для контраста среди светлых. */
export function PackageCard({ pkg }: PackageCardProps) {
  const { t } = useTranslation();

  return (
    <article
      data-tone={pkg.popular ? 'dark' : undefined}
      className={cn(styles.card, pkg.popular && styles.popular)}
    >
      {pkg.popular && <span className={styles.badge}>{t('home.packages.popular')}</span>}

      <div className={styles.head}>
        <h3 className={styles.name}>{t(`home.packages.items.${pkg.id}.name`)}</h3>
        <p className={styles.price}>{t(`home.packages.items.${pkg.id}.price`)}</p>
      </div>

      <ul className={styles.features}>
        {pkg.featureKeys.map((key) => (
          <li key={key} className={styles.feature}>
            <span className={styles.check}>
              <IconCheck className={styles.checkIcon} />
            </span>
            {t(`home.packages.features.${key}`)}
          </li>
        ))}
      </ul>
    </article>
  );
}
