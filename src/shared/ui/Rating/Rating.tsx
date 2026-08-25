import { cn } from '../../lib/cn/cn';
import { IconStar } from '../icons';
import styles from './Rating.module.scss';

interface RatingProps {
  /** Значение 0..max. */
  value: number;
  max?: number;
  /** Показать числовое значение рядом со звёздами. */
  showValue?: boolean;
  /** Доступная подпись (по умолчанию «value / max»). */
  label?: string;
  className?: string;
}

/** Рейтинг звёздами (readonly). Поддерживает дробное значение через clip-оверлей. */
export function Rating({ value, max = 5, showValue, label, className }: RatingProps) {
  const pct = Math.max(0, Math.min(1, value / max)) * 100;
  const aria = label ?? `${value} / ${max}`;

  return (
    <span className={cn(styles.root, className)} role="img" aria-label={aria}>
      <span className={styles.stars} aria-hidden="true">
        <span className={styles.track}>
          {Array.from({ length: max }, (_, i) => (
            <IconStar key={i} />
          ))}
        </span>
        <span className={styles.fill} style={{ width: `${pct}%` }}>
          {Array.from({ length: max }, (_, i) => (
            <IconStar key={i} />
          ))}
        </span>
      </span>
      {showValue && (
        <span className={styles.value} aria-hidden="true">
          {value.toFixed(1)}
        </span>
      )}
    </span>
  );
}
