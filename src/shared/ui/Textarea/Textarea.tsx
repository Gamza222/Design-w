import { forwardRef, type TextareaHTMLAttributes } from 'react';

import { cn } from '../../lib/cn/cn';
import styles from './Textarea.module.scss';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Состояние ошибки (визуально + aria-invalid). */
  invalid?: boolean;
}

/** Многострочное поле (управляется родителем). Theme-agnostic. */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { invalid, className, rows = 4, ...rest },
  ref,
) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      aria-invalid={invalid || undefined}
      className={cn(styles.textarea, invalid && styles.invalid, className)}
      {...rest}
    />
  );
});
