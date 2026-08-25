import type { ElementType, ReactNode, Ref } from 'react';

import { cn } from '../../lib/cn/cn';
import styles from './Container.module.scss';

interface ContainerProps {
  as?: ElementType;
  className?: string;
  children: ReactNode;
  /** Ref на корневой элемент (для scope-анимаций появления). */
  ref?: Ref<HTMLElement>;
}

/** Centered, max-width content wrapper with horizontal padding. */
export function Container({ as: Tag = 'div', className, children, ref }: ContainerProps) {
  return (
    <Tag ref={ref} className={cn(styles.container, className)}>
      {children}
    </Tag>
  );
}
