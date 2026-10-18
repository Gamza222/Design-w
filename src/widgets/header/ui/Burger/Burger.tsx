import type { ButtonHTMLAttributes } from 'react';

import { cn } from '@shared/lib';

import styles from './Burger.module.scss';

interface BurgerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  open: boolean;
}

/** Кнопка-гамбургер: три линии ↔ крестик (управляется пропом `open`). */
export function Burger({ open, className, ...rest }: BurgerProps) {
  return (
    <button type="button" className={cn(styles.burger, className)} aria-expanded={open} {...rest}>
      <span className={cn(styles.line, open && styles.lineOpen)} />
    </button>
  );
}
