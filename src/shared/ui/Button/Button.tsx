import type { ButtonHTMLAttributes, ReactNode } from 'react';

import { cn } from '../../lib/cn/cn';
import { AppLink } from '../AppLink/AppLink';
import styles from './Button.module.scss';

type Variant = 'primary' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  /** Размер кнопки (паддинги + кегль). md — по умолчанию. */
  size?: Size;
  /** When set, renders a locale-aware internal link styled as a button. */
  to?: string;
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  to,
  className,
  children,
  ...rest
}: ButtonProps) {
  const classes = cn(styles.button, styles[variant], styles[size], className);

  if (to) {
    return (
      <AppLink to={to} className={classes}>
        {children}
      </AppLink>
    );
  }

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
