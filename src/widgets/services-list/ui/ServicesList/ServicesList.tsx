import { SERVICES, ServiceCard } from '@entities/service';
import { Container } from '@shared/ui';

import styles from './ServicesList.module.scss';

interface ServicesListProps {
  title?: string;
}

export function ServicesList({ title }: ServicesListProps) {
  return (
    <Container>
      {title && <h2 className={styles.title}>{title}</h2>}
      <div className={styles.grid}>
        {SERVICES.map((service, index) => (
          <ServiceCard key={service.id} service={service} index={index} />
        ))}
      </div>
    </Container>
  );
}
