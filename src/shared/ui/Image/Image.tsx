import type { ImgHTMLAttributes } from 'react';

import { cn } from '../../lib/cn/cn';
import styles from './Image.module.scss';

interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  /** CSS aspect-ratio, e.g. "4 / 3". */
  ratio?: string;
  /** LCP/above-the-fold image: грузим сразу и приоритетно (обложки кейса/статьи). */
  priority?: boolean;
}

/** Lazy, responsive image with optional fixed aspect ratio.
 *  По умолчанию lazy + async-декодирование (меньше джанка на прокрутке). Для главной картинки
 *  экрана передаём `priority` → eager + fetchpriority=high (лучше LCP, нет «прыжка» обложки). */
export function Image({
  ratio,
  priority = false,
  className,
  style,
  alt = '',
  loading,
  ...rest
}: ImageProps) {
  return (
    <img
      className={cn(styles.image, className)}
      style={{ aspectRatio: ratio, ...style }}
      alt={alt}
      loading={loading ?? (priority ? 'eager' : 'lazy')}
      decoding="async"
      fetchPriority={priority ? 'high' : undefined}
      {...rest}
    />
  );
}
