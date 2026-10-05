import { describe, expect, it } from 'vitest';

import {
  canonicalPathname,
  getLocaleFromPath,
  homeSectionPath,
  localizePath,
  stripLocale,
} from './routes';

describe('route locale helpers', () => {
  it('keeps the default locale unprefixed', () => {
    expect(localizePath('/blog', 'ru')).toBe('/blog/');
    expect(localizePath('/', 'ru')).toBe('/');
  });

  it('prefixes a non-default locale', () => {
    expect(localizePath('/blog', 'en')).toBe('/en/blog/');
    expect(localizePath('/', 'en')).toBe('/en/');
    expect(localizePath('/blog', 'be')).toBe('/by/blog/');
    expect(localizePath('/', 'be')).toBe('/by/');
  });

  it('keeps home section hashes after locale prefixing', () => {
    const services = homeSectionPath('services');
    expect(localizePath(services, 'ru')).toBe('/#services');
    expect(localizePath(services, 'en')).toBe('/en/#services');
    expect(localizePath(services, 'be')).toBe('/by/#services');
  });

  it('keeps queries and fragments after the canonical directory slash', () => {
    expect(canonicalPathname('/portfolio/minimal-loft?utm_source=ad#details')).toBe(
      '/portfolio/minimal-loft/?utm_source=ad#details',
    );
    expect(localizePath('/services/?ref=home#packages', 'be')).toBe(
      '/by/services/?ref=home#packages',
    );
    expect(canonicalPathname('/en///')).toBe('/en/');
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

  it.each(['', '/en', '/by'])('normalizes directory URLs with locale prefix "%s"', (prefix) => {
    expect(stripLocale(`${prefix}/`)).toBe('/');
    for (const path of [
      '/privacy',
      '/offer',
      '/requisites',
      '/consent',
      '/planirovka-kvartiry',
      '/3d-vizualizaciya-interera',
      '/eskiznyj-dizajn-proekt',
    ]) {
      expect(stripLocale(`${prefix}${path}/`)).toBe(path);
      expect(stripLocale(`${prefix}${path}///`)).toBe(path);
    }
  });
});
