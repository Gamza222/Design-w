import { describe, expect, it } from 'vitest';

import { getLocaleFromPath, localizePath, stripLocale } from './routes';

describe('route locale helpers', () => {
  it('keeps the default locale unprefixed', () => {
    expect(localizePath('/blog', 'ru')).toBe('/blog');
    expect(localizePath('/', 'ru')).toBe('/');
  });

  it('prefixes a non-default locale', () => {
    expect(localizePath('/blog', 'en')).toBe('/en/blog');
    expect(localizePath('/', 'en')).toBe('/en');
  });

  it('detects the locale from a pathname', () => {
    expect(getLocaleFromPath('/en/blog')).toBe('en');
    expect(getLocaleFromPath('/blog')).toBe('ru');
    expect(getLocaleFromPath('/')).toBe('ru');
  });

  it('strips the locale back to a canonical path', () => {
    expect(stripLocale('/en/blog')).toBe('/blog');
    expect(stripLocale('/en')).toBe('/');
    expect(stripLocale('/blog')).toBe('/blog');
  });
});
