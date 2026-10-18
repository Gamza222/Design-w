import type { ReactNode } from 'react';

import { cn } from '../../lib/cn/cn';
import styles from './Field.module.scss';

interface FieldProps {
  /** id контрола внутри — для label htmlFor и связок описания. */
  id: string;
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
}

/**
 * Обёртка поля формы: label + контрол + ошибка/подсказка.
 * Контрол передаётся как children с тем же `id`; описание доступно по `${id}-error`/`${id}-hint`
 * (контрол получает aria-describedby/invalid от формы — см. Input.invalid).
 */
export function Field({ id, label, error, hint, required, className, children }: FieldProps) {
  return (
    <div className={cn(styles.field, className)}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {required && (
          <span aria-hidden="true" className={styles.req}>
            {' *'}
          </span>
        )}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className={styles.hint}>
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className={styles.error}>
          {error}
        </p>
      )}
    </div>
  );
}
