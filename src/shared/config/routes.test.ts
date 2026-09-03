import { describe, expect, it } from 'vitest';

import { getLocaleFromPath, homeSectionPath, localizePath, stripLocale } from './routes';

describe('route locale helpers', () => {
  it('keeps the default locale unprefixed', () => {
    expect(localizePath('/blog', 'ru')).toBe('/blog');
    expect(localizePath('/', 'ru')).toBe('/');
  });

  it('prefixes a non-default locale', () => {
    expect(localizePath('/blog', 'en')).toBe('/en/blog');
    expect(localizePath('/', 'en')).toBe('/en');
    expect(localizePath('/blog', 'be')).toBe('/by/blog');
    expect(localizePath('/', 'be')).toBe('/by');
  });

  it('keeps home section hashes after locale prefixing', () => {
    const services = homeSectionPath('services');
    expect(localizePath(services, 'ru')).toBe('/#services');
    expect(localizePath(services, 'en')).toBe('/en#services');
    expect(localizePath(services, 'be')).toBe('/by#services');
  });

  it('detects the locale from a pathname', () => {
    expect(getLocaleFromPath('/en/blog')).toBe('en');
    expect(getLocaleFromPath('/by/blog')).toBe('be');
    expect(getLocaleFromPath('/blog')).toBe('ru');
    expect(getLocaleFromPath('/')).toBe('ru');
  });

  it('strips the locale back to a canonical path', () => {
    expect(stripLocale('/en/blog')).toBe('/blog');
    expect(stripLocale('/en')).toBe('/');
    expect(stripLocale('/by/blog')).toBe('/blog');
    expect(stripLocale('/by')).toBe('/');
    expect(stripLocale('/blog')).toBe('/blog');
  });
});
