import { cn } from '../../lib/cn/cn';
import { AppLink } from '../AppLink/AppLink';
import styles from './Breadcrumbs.module.scss';

interface Crumb {
  label: string;
  /** Канонический путь (локаль добавит AppLink). Последняя крошка — без ссылки. */
  to?: string;
}

interface BreadcrumbsProps {
  items: Crumb[];
  className?: string;
  /** Подпись навигации — обязательна и приходит из i18n вызывающего (не хардкодим язык в shared). */
  'aria-label': string;
}

/** Хлебные крошки: nav > ol, aria-current на последней. Theme-agnostic. */
export function Breadcrumbs({ items, className, 'aria-label': ariaLabel }: BreadcrumbsProps) {
  return (
    <nav aria-label={ariaLabel} className={cn(styles.nav, className)}>
      <ol className={styles.list}>
        {items.map((item, i) => {
          const last = i === items.length - 1;

          return (
            <li key={item.label} className={styles.item}>
              {item.to && !last ? (
                <AppLink to={item.to} className={styles.link}>
                  {item.label}
                </AppLink>
              ) : (
                <span aria-current={last ? 'page' : undefined} className={styles.current}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
