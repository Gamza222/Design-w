import { type ReactNode, useState } from 'react';

import { cn } from '../../lib/cn/cn';
import { IconMinus, IconPlus } from '../icons';
import styles from './Stepper.module.scss';

interface StepperProps {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: ReactNode;
  /** Доступная подпись поля ввода. */
  label?: string;
  /** Подписи кнопок для скринридеров — обязательны и приходят из i18n вызывающего
   *  (дефолты на одном языке протекали бы во вторую локаль). */
  decreaseLabel: string;
  increaseLabel: string;
  className?: string;
}

/** Счётчик «− значение +» с ручным вводом значения (площадь и т.п.).
 *  Пока пользователь печатает, значение живёт в черновике (может быть пустым);
 *  коммит по blur/Enter с клампом к [min, max], невалидный ввод откатывается.
 *  Кнопки ± на границах получают aria-disabled (не disabled) — фокус не падает на body. */
export function Stepper({
  value,
  onChange,
  min = 0,
  max = Infinity,
  step = 1,
  unit,
  label,
  decreaseLabel,
  increaseLabel,
  className,
}: StepperProps) {
  const clamp = (n: number) => Math.min(max, Math.max(min, n));
  const [draft, setDraft] = useState<string | null>(null);

  const commit = () => {
    if (draft === null) return;
    const parsed = Number.parseInt(draft, 10);
    if (!Number.isNaN(parsed)) onChange(clamp(parsed));
    setDraft(null);
  };

  const atMin = value <= min;
  const atMax = value >= max;

  return (
    <div className={cn(styles.stepper, className)} role="group">
      <button
        type="button"
        className={styles.btn}
        aria-label={decreaseLabel}
        aria-disabled={atMin}
        onClick={() => {
          if (!atMin) onChange(clamp(value - step));
        }}
      >
        <IconMinus />
      </button>
      <span className={styles.value}>
        <input
          className={styles.input}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          value={draft ?? String(value)}
          aria-label={label}
          onChange={(e) => setDraft(e.target.value.replace(/\D/g, '').slice(0, 4))}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') e.currentTarget.blur();
          }}
          onFocus={(e) => e.target.select()}
        />
        {unit && <span className={styles.unit}>{unit}</span>}
      </span>
      {/* Кнопки ± меняют значение, пока фокус на них: озвучиваем через live-регион
          (изменение value у input скринридеры сами не читают). Значение — с единицей,
          голое число без контекста непонятно. */}
      <span className={styles.srLive} aria-live="polite">
        {value}
        {unit ? <> {unit}</> : null}
      </span>
      <button
        type="button"
        className={styles.btn}
        aria-label={increaseLabel}
        aria-disabled={atMax}
        onClick={() => {
          if (!atMax) onChange(clamp(value + step));
        }}
      >
        <IconPlus />
      </button>
    </div>
  );
}
