import { Container } from '../Container/Container';
import styles from './PageHeader.module.scss';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

/** Standard page intro (title + optional subtitle). */
export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <Container className={styles.header}>
      <h1 className={styles.title}>{title}</h1>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </Container>
  );
}
