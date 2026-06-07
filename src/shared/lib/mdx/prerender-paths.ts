// NODE-ONLY module. Imported by react-router.config.ts to enumerate every concrete
// path for static prerendering. MUST NOT import React or use import.meta.glob —
// it runs in the build/esbuild context, so it reads content from disk directly.

import { readFileSync } from 'node:fs';
import { basename } from 'node:path';
import { cwd } from 'node:process';

import fg from 'fast-glob';
import matter from 'gray-matter';

import { LOCALES, isLocale, type Locale } from '../../config/locales';
import { localizePath, STATIC_PATHS } from '../../config/routes';

type ContentType = 'blog' | 'portfolio';

interface ContentEntry {
  type: ContentType;
  locale: Locale;
  slug: string;
}

function readContent(type: ContentType): ContentEntry[] {
  const files = fg.sync(`content/${type}/*/*.mdx`, { cwd: cwd(), absolute: true });
  const entries: ContentEntry[] = [];

  for (const file of files) {
    const locale = file.split('/').at(-2);
    if (!isLocale(locale)) continue;

    const { data } = matter(readFileSync(file, 'utf8'));
    if (data.draft) continue;

    entries.push({ type, locale, slug: basename(file, '.mdx') });
  }

  return entries;
}

/** Full list of literal paths to statically prerender (static pages × locales + content). */
export function getAllPrerenderPaths(): string[] {
  const paths = new Set<string>();

  for (const locale of LOCALES) {
    for (const path of STATIC_PATHS) {
      paths.add(localizePath(path, locale));
    }
  }

  for (const type of ['blog', 'portfolio'] as const) {
    const base = type === 'blog' ? '/blog' : '/portfolio';
    for (const { locale, slug } of readContent(type)) {
      paths.add(localizePath(`${base}/${slug}`, locale));
    }
  }

  return [...paths].sort();
}
