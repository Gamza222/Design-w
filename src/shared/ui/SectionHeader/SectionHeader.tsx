import type { ElementType, ReactNode } from 'react';

import { cn } from '../../lib/cn/cn';
import styles from './SectionHeader.module.scss';

interface SectionHeaderProps {
  eyebrow?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: 'start' | 'center';
  /** Тег заголовка (h2 по умолчанию). */
  as?: ElementType;
  className?: string;
}

/** Шапка секции: надзаголовок (eyebrow) + заголовок + подзаголовок. Theme-agnostic. */
export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = 'start',
  as: Heading = 'h2',
  className,
}: SectionHeaderProps) {
  return (
    <header className={cn(styles.root, styles[align], className)}>
      {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
      <Heading className={styles.title}>{title}</Heading>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </header>
  );
}
