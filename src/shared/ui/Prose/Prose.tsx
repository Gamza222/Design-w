import type { ReactNode } from 'react';

import { cn } from '../../lib/cn/cn';
import styles from './Prose.module.scss';

interface ProseProps {
  className?: string;
  children: ReactNode;
}

/** Readable typography wrapper for rendered MDX content. */
export function Prose({ className, children }: ProseProps) {
  return <div className={cn(styles.prose, className)}>{children}</div>;
}
