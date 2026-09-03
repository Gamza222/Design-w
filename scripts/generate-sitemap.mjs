// Генерация sitemap.xml после `react-router build`: обходим build/client и собираем
// все прорендеренные страницы (каталоги с index.html). Запускается из npm run build,
// поэтому карта всегда синхронна реальному набору статических путей (включая MDX-слаги).

import { readdirSync, statSync, writeFileSync, existsSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { cwd, exit } from 'node:process';

const SITE_URL = process.env.VITE_SITE_URL ?? 'https://designseichas.ru';
const CLIENT_DIR = join(cwd(), 'build', 'client');

if (!existsSync(CLIENT_DIR)) {
  console.error('generate-sitemap: build/client not found — run `react-router build` first.');
  exit(1);
}

/** Рекурсивно находим каталоги с index.html (кроме служебного SPA-фолбэка). */
function collectPages(dir) {
  const pages = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      pages.push(...collectPages(full));
    } else if (entry === 'index.html') {
      const rel = relative(CLIENT_DIR, dir).split(sep).join('/');
      pages.push(rel === '' ? '/' : `/${rel}`);
    }
  }
  return pages;
}

const urls = collectPages(CLIENT_DIR).sort();

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...urls.map((path) => `  <url><loc>${SITE_URL}${path === '/' ? '' : path}</loc></url>`),
  '</urlset>',
  '',
].join('\n');

writeFileSync(join(CLIENT_DIR, 'sitemap.xml'), xml);
console.log(`generate-sitemap: ${urls.length} URLs → build/client/sitemap.xml`);
