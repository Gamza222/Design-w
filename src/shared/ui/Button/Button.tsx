import type { ButtonHTMLAttributes, ReactNode } from 'react';

import { cn } from '../../lib/cn/cn';
import { AppLink } from '../AppLink/AppLink';
import styles from './Button.module.scss';

type Variant = 'primary' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  /** When set, renders a locale-aware internal link styled as a button. */
  to?: string;
  children: ReactNode;
}

export function Button({ variant = 'primary', to, className, children, ...rest }: ButtonProps) {
  const classes = cn(styles.button, styles[variant], className);

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
