import type { ReactNode } from 'react';

import { cn } from '../../lib/cn/cn';
import { IconMinus, IconPlus } from '../icons';
import styles from './Stepper.module.scss';

interface StepperProps {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: ReactNode;
  /** Доступная подпись группы. */
  label?: string;
  /** Подписи кнопок для скринридеров. */
  decreaseLabel?: string;
  increaseLabel?: string;
  className?: string;
}

/** Счётчик − значение + (площадь и т.п.). Клампит к [min, max], блокирует кнопки на границах. */
export function Stepper({
  value,
  onChange,
  min = 0,
  max = Infinity,
  step = 1,
  unit,
  label,
  decreaseLabel = 'Уменьшить',
  increaseLabel = 'Увеличить',
  className,
}: StepperProps) {
  const clamp = (n: number) => Math.min(max, Math.max(min, n));

  return (
    <div className={cn(styles.stepper, className)} role="group" aria-label={label}>
      <button
        type="button"
        className={styles.btn}
        aria-label={decreaseLabel}
        disabled={value <= min}
        onClick={() => onChange(clamp(value - step))}
      >
        <IconMinus />
      </button>
      <span className={styles.value} aria-live="polite">
        {value}
        {unit && <span className={styles.unit}>{unit}</span>}
      </span>
      <button
        type="button"
        className={styles.btn}
        aria-label={increaseLabel}
        disabled={value >= max}
        onClick={() => onChange(clamp(value + step))}
      >
        <IconPlus />
      </button>
    </div>
  );
}
