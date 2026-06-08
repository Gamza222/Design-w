import type { SVGProps } from 'react';

import { cn } from '../../lib/cn/cn';
import { LOGO_BASE_PATH, LOGO_FACE_PATH, LOGO_VIEWBOX } from './paths';
import styles from './Logo.module.scss';

interface LogoProps extends SVGProps<SVGSVGElement> {
  /** Доступное имя логотипа для скринридеров. */
  title?: string;
}

/**
 * Логотип AC как inline-SVG из двух гладких контуров: полный силуэт (база, тёмный) и
 * передняя грань (яркий акцент) поверх. Видимая разница между ними и есть ровная 3D-экструзия.
 * Цвет берётся из `currentColor` (по умолчанию — акцент), глубина выводится из него же через
 * color-mix — поэтому цвет и «тень» меняются вместе с палитрой. Размер задаётся `font-size`/`height`.
 */
export function Logo({ className, title = 'AC', ...rest }: LogoProps) {
  return (
    <svg
      className={cn(styles.logo, className)}
      viewBox={LOGO_VIEWBOX}
      role="img"
      aria-label={title}
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <path className={styles.base} d={LOGO_BASE_PATH} />
      <path className={styles.face} d={LOGO_FACE_PATH} />
    </svg>
  );
}
