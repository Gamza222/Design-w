import { forwardRef, type InputHTMLAttributes } from 'react';

import { cn } from '../../lib/cn/cn';
import styles from './Input.module.scss';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Состояние ошибки (визуально + aria-invalid). */
  invalid?: boolean;
}

/** Текстовое поле (управляется родителем). Theme-agnostic. */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { invalid, className, ...rest },
  ref,
) {
  return (
    <input
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(styles.input, invalid && styles.invalid, className)}
      {...rest}
    />
  );
});
