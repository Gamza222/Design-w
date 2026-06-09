import type { ReactNode } from 'react';

import { cn } from '../../lib/cn/cn';
import styles from './IconBadge.module.scss';

interface IconBadgeProps {
  /** Элемент иконки (Icon* из shared/ui/icons). */
  icon: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  tone?: 'accent' | 'surface';
  className?: string;
}

/** Иконка в скруглённой подложке (этапы, выгоды, доп.услуги). Theme-agnostic. */
export function IconBadge({ icon, size = 'md', tone = 'surface', className }: IconBadgeProps) {
  return (
    <span className={cn(styles.badge, styles[size], styles[tone], className)} aria-hidden="true">
      {icon}
    </span>
  );
}
