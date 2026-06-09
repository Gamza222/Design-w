import type { ReactNode } from 'react';

import { cn } from '../../lib/cn/cn';
import { IconChevronDown } from '../icons';
import styles from './Accordion.module.scss';

interface AccordionProps {
  /** Уникальный id для связки button ↔ region (aria-controls/labelledby). */
  id: string;
  summary: ReactNode;
  open: boolean;
  onToggle: () => void;
  className?: string;
  children: ReactNode;
}

/**
 * Один аккордеон (список собирается в виджете). Доступный: button + region,
 * aria-expanded/controls, клавиатура «бесплатно» от <button>. Высота — grid-rows 0fr→1fr
 * (safe к reduced-motion; контент остаётся в DOM → виден для SEO/no-JS).
 */
export function Accordion({ id, summary, open, onToggle, className, children }: AccordionProps) {
  return (
    <div className={cn(styles.item, open && styles.open, className)}>
      <h3 className={styles.heading}>
        <button
          type="button"
          id={`${id}-btn`}
          aria-expanded={open}
          aria-controls={`${id}-region`}
          onClick={onToggle}
          className={styles.trigger}
        >
          <span>{summary}</span>
          <IconChevronDown className={styles.chevron} aria-hidden="true" />
        </button>
      </h3>
      <div id={`${id}-region`} role="region" aria-labelledby={`${id}-btn`} className={styles.region}>
        <div className={styles.inner}>{children}</div>
      </div>
    </div>
  );
}
