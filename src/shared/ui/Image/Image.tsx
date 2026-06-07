import type { ImgHTMLAttributes } from 'react';

import { cn } from '../../lib/cn/cn';
import styles from './Image.module.scss';

interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  /** CSS aspect-ratio, e.g. "4 / 3". */
  ratio?: string;
}

/** Lazy, responsive image with optional fixed aspect ratio. */
export function Image({
  ratio,
  className,
  style,
  alt = '',
  loading = 'lazy',
  ...rest
}: ImageProps) {
  return (
    <img
      className={cn(styles.image, className)}
      style={{ aspectRatio: ratio, ...style }}
      alt={alt}
      loading={loading}
      {...rest}
    />
  );
}
