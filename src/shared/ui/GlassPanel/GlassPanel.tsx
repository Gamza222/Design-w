import type { ElementType, ReactNode } from 'react';

import { cn } from '../../lib/cn/cn';
import styles from './GlassPanel.module.scss';

interface GlassPanelProps {
  as?: ElementType;
  /** Тонкая золотая линия сверху панели. */
  withLine?: boolean;
  className?: string;
  children: ReactNode;
}

/**
 * Стеклянная панель: blur + полупрозрачный navy + hairline золотой бордер.
 * Единственный примитив, читающий --glass-* напрямую (это и есть стеклянная абстракция).
 */
export function GlassPanel({ as: Tag = 'div', withLine = true, className, children }: GlassPanelProps) {
  return <Tag className={cn(styles.panel, withLine && styles.lined, className)}>{children}</Tag>;
}
