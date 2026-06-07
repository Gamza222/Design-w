import type { ReactNode } from 'react';

import { cn } from '../../lib/cn/cn';
import styles from './Section.module.scss';

interface SectionProps {
  id?: string;
  className?: string;
  /** Tighten vertical rhythm for compact sections. */
  compact?: boolean;
  children: ReactNode;
}

/** Page section with consistent vertical spacing. */
export function Section({ id, className, compact, children }: SectionProps) {
  return (
    <section id={id} className={cn(styles.section, compact && styles.compact, className)}>
      {children}
    </section>
  );
}
