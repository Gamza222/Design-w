import type { ElementType, ReactNode } from 'react';

import { cn } from '../../lib/cn/cn';
import styles from './Container.module.scss';

interface ContainerProps {
  as?: ElementType;
  className?: string;
  children: ReactNode;
}

/** Centered, max-width content wrapper with horizontal padding. */
export function Container({ as: Tag = 'div', className, children }: ContainerProps) {
  return <Tag className={cn(styles.container, className)}>{children}</Tag>;
}
