import { useTranslation } from 'react-i18next';

import { getTariff, TARIFF_IDS, PROJECT_PACKAGE_IDS } from '@entities/package';
import { openLeadDialog, useLocale, useScrollReveal } from '@shared/lib';
import { Button, Container } from '@shared/ui';

import styles from './ServicesList.module.scss';

interface ServicesListProps {
  title?: string;
}

export function ServicesList({ title }: ServicesListProps) {
  const { t } = useTranslation();
  const locale = useLocale();
  const root = useScrollReveal<HTMLDivElement>([`.${styles.title}`, `.${styles.grid} > *`]);

  return (
    <Container ref={root}>
      <h2 className={styles.title}>{title ?? t('tariffs.allPackages')}</h2>
      <div className={styles.grid}>
        {TARIFF_IDS.map((id) => {
          const tariff = getTariff(id, locale);
          const packageId = PROJECT_PACKAGE_IDS.find((candidate) => candidate === id);
          return (
            <article key={id} className={styles.card}>
              <h3>{tariff.name}</h3>
              <p>{tariff.description}</p>
              <p className={styles.price}>{tariff.priceLabel}</p>
              {tariff.exclusions.map((item) => (
                <p key={item} className={styles.note}>
                  {item}
                </p>
              ))}
              <Button
                type="button"
                variant="ghost"
                onClick={() =>
                  openLeadDialog({
                    source: 'services-list',
                    service: tariff.name,
                    packageId,
                    packageName: packageId ? tariff.name : undefined,
                    currency: tariff.currency,
                    preliminary: tariff.from,
                  })
                }
              >
                {t('tariffs.select')}
              </Button>
            </article>
          );
        })}
      </div>
    </Container>
  );
}
