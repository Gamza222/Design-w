import type { ReactNode } from 'react';

import { cn } from '../../lib/cn/cn';
import styles from './Section.module.scss';

type Tone = 'dark' | 'light' | 'glass';

interface SectionProps {
  id?: string;
  className?: string;
  /** Tighten vertical rhythm for compact sections. */
  compact?: boolean;
  /** Переопределяет семантические токены палитры для поддерева через [data-tone]. */
  tone?: Tone;
  children: ReactNode;
}

/** Page section with consistent vertical spacing and optional color tone. */
export function Section({ id, className, compact, tone, children }: SectionProps) {
  return (
    <section
      id={id}
      data-tone={tone}
      className={cn(styles.section, compact && styles.compact, className)}
    >
      {children}
    </section>
  );
}
