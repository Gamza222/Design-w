import { describe, expect, it } from 'vitest';

import { formatMoney } from './formatMoney';

describe('formatMoney', () => {
  it.each([
    ['ru', '12\u00a0816\u00a0₽'],
    ['en', '12,816\u00a0₽'],
    ['be', '12\u00a0816\u00a0BYN'],
  ] as const)('formats integer prices for %s', (locale, result) => {
    expect(formatMoney(12_816, locale)).toBe(result);
  });
});
