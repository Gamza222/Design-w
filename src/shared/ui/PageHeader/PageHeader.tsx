import { useScrollReveal } from '../../lib/reveal/useScrollReveal';
import { Container } from '../Container/Container';
import styles from './PageHeader.module.scss';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

/** Standard page intro (title + optional subtitle). Заголовок и подзаголовок всплывают на входе
 *  (хук срабатывает сразу — шапка над сгибом) и при SPA-переходах между страницами. */
export function PageHeader({ title, subtitle }: PageHeaderProps) {
  const root = useScrollReveal<HTMLDivElement>([`.${styles.title}`, `.${styles.subtitle}`], {
    start: 'top 95%',
    stagger: 0.12,
  });

  return (
    <Container className={styles.header} ref={root}>
      <h1 className={styles.title}>{title}</h1>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </Container>
  );
}
