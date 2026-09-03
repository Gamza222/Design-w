import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

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
  /** When set, renders a regular external link styled as a button. */
  href?: string;
  target?: string;
  rel?: string;
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  to,
  href,
  target,
  rel,
  className,
  children,
  ...rest
}: ButtonProps) {
  const classes = cn(styles.button, styles[variant], styles[size], className);
  const anchorProps = rest as AnchorHTMLAttributes<HTMLAnchorElement>;

  if (to) {
    return (
      <AppLink to={to} className={classes} {...anchorProps}>
        {children}
      </AppLink>
    );
  }

  if (href) {
    return (
      <a href={href} target={target} rel={rel} className={classes} {...anchorProps}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
