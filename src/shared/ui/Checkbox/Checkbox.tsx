import { useId, type InputHTMLAttributes, type ReactNode } from 'react';

import { cn } from '../../lib/cn/cn';
import { IconCheck } from '../icons';
import styles from './Checkbox.module.scss';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: ReactNode;
}

/** Чекбокс: нативный input (доступный) + кастомный бокс с галочкой. */
export function Checkbox({ label, className, id, ...rest }: CheckboxProps) {
  const auto = useId();
  const inputId = id ?? auto;

  return (
    <label htmlFor={inputId} className={cn(styles.root, className)}>
      <input id={inputId} type="checkbox" className={styles.input} {...rest} />
      <span className={styles.box} aria-hidden="true">
        <IconCheck className={styles.check} />
      </span>
      <span className={styles.label}>{label}</span>
    </label>
  );
}
