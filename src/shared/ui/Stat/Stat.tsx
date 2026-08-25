import type { ReactNode } from 'react';

import { cn } from '../../lib/cn/cn';
import styles from './Stat.module.scss';

interface StatProps {
  value: ReactNode;
  label: ReactNode;
  icon?: ReactNode;
  className?: string;
}

/** Стат-блок «значение + подпись» (50+, 30 минут, 24/7, 0 ₽). Theme-agnostic. */
export function Stat({ value, label, icon, className }: StatProps) {
  return (
    <div className={cn(styles.stat, className)}>
      {icon && <span className={styles.icon}>{icon}</span>}
      <span className={styles.value}>{value}</span>
      <span className={styles.label}>{label}</span>
    </div>
  );
}
