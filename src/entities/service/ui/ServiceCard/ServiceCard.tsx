import { useLocale } from '@shared/lib';

import type { Service } from '../../model/types';
import styles from './ServiceCard.module.scss';

interface ServiceCardProps {
  service: Service;
  index: number;
}

export function ServiceCard({ service, index }: ServiceCardProps) {
  const locale = useLocale();

  return (
    <article className={styles.card}>
      <span className={styles.number}>{String(index + 1).padStart(2, '0')}</span>
      <h3 className={styles.title}>{service.title[locale]}</h3>
      <p className={styles.description}>{service.description[locale]}</p>
    </article>
  );
}
