import type { ElementType, ReactNode } from 'react';

import { cn } from '../../lib/cn/cn';
import { useReveal } from '../../lib/reveal/useReveal';
import styles from './Reveal.module.scss';

interface RevealProps {
  as?: ElementType;
  stagger?: number;
  y?: number;
  className?: string;
  children: ReactNode;
}

/**
 * Обёртка появления по скроллу. Прямые потомки с атрибутом `data-reveal` плавно
 * всплывают (fade-up). Reduced-motion → контент сразу видим (см. useReveal).
 */
export function Reveal({ as: Tag = 'div', stagger, y, className, children }: RevealProps) {
  const ref = useReveal<HTMLElement>({ stagger, y });

  return (
    <Tag ref={ref} className={cn(styles.root, className)}>
      {children}
    </Tag>
  );
}
