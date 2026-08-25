import type { ReactNode } from 'react';

import { cn } from '../../lib/cn/cn';
import styles from './Badge.module.scss';

interface BadgeProps {
  variant?: 'accent' | 'neutral' | 'outline';
  className?: string;
  children: ReactNode;
}

/** Маленький бейдж/тег (категория, статус, «Популярный»). Theme-agnostic. */
export function Badge({ variant = 'neutral', className, children }: BadgeProps) {
  return <span className={cn(styles.badge, styles[variant], className)}>{children}</span>;
}
