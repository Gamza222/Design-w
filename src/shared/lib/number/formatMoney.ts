import type { Locale } from '../../config/locales';

const NBSP = '\u00a0';

/** Stable integer currency formatting for identical prerendered and browser output. */
export function formatMoney(amount: number, locale: Locale): string {
  const rounded = Math.round(amount);
  const sign = rounded < 0 ? '-' : '';
  const separator = locale === 'en' ? ',' : NBSP;
  const grouped = Math.abs(rounded)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, separator);
  const currency = locale === 'be' ? 'BYN' : '₽';

  return `${sign}${grouped}${NBSP}${currency}`;
}
