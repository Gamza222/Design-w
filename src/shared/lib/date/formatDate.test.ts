import { describe, expect, it } from 'vitest';

import { formatDate } from './formatDate';

describe('formatDate', () => {
  it.each([
    ['ru', '20 июня 2026 г.'],
    ['en', 'June 20, 2026'],
    ['be', '20 чэрвеня 2026 г.'],
  ] as const)('formats ISO dates for %s without relying on runtime ICU data', (locale, result) => {
    expect(formatDate('2026-06-20', locale)).toBe(result);
  });

  it('returns an unsupported value unchanged', () => {
    expect(formatDate('not-a-date', 'ru')).toBe('not-a-date');
  });
});
