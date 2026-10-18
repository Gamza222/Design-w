import type { ElementType, ReactNode } from 'react';

import { cn } from '../../lib/cn/cn';
import styles from './GlassPanel.module.scss';

interface GlassPanelProps {
  as?: ElementType;
  /** Hairline-бордер вокруг панели. */
  bordered?: boolean;
  /** Тонкая золотая линия сверху панели. */
  withLine?: boolean;
  className?: string;
  children: ReactNode;
}

/**
 * Стеклянная панель: blur + полупрозрачный navy + hairline золотой бордер.
 * Единственный примитив, читающий --glass-* напрямую (это и есть стеклянная абстракция).
 */
export function GlassPanel({
  as: Tag = 'div',
  bordered = true,
  withLine = true,
  className,
  children,
}: GlassPanelProps) {
  return (
    <Tag className={cn(styles.panel, bordered && styles.bordered, withLine && styles.lined, className)}>
      {children}
    </Tag>
  );
}
