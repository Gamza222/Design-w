import type { ReactNode } from 'react';

import { cn } from '../../lib/cn/cn';
import styles from './PillToggle.module.scss';

interface PillToggleProps {
  pressed: boolean;
  onPressedChange: (next: boolean) => void;
  icon?: ReactNode;
  className?: string;
  children: ReactNode;
}

/** Пилюля-переключатель (доп.услуги калькулятора): aria-pressed + свечение в active. */
export function PillToggle({ pressed, onPressedChange, icon, className, children }: PillToggleProps) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={() => onPressedChange(!pressed)}
      className={cn(styles.pill, pressed && styles.on, className)}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      <span>{children}</span>
    </button>
  );
}
