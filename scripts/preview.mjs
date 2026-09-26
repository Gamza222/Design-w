// Локальный preview собранной статики, зеркалящий поведение Vercel:
//  - `/services` и `/services/` → build/client/services/index.html (директорийный index);
//  - неизвестный путь → 404.html со статусом 404 (Vercel для статики делает то же сам).
// `vite preview` для этого не подходит: его SPA-режим отдаёт корневой index.html для любых
// путей без хвостового слэша → на каждой странице кроме главной ловится hydration mismatch.

import { createServer } from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { extname, join, normalize, sep } from 'node:path';
import { cwd, argv, exit } from 'node:process';
import { createGzip } from 'node:zlib';
import { pipeline } from 'node:stream';

const ROOT = join(cwd(), 'build', 'client');
const NOT_FOUND = join(ROOT, '404.html');

const args = argv.slice(2);
const flag = (name, def) => {
  const i = args.indexOf(`--${name}`);
  return i !== -1 && args[i + 1] ? args[i + 1] : def;
};
const PORT = Number(flag('port', 3000));
const HOST = flag('host', '127.0.0.1');

if (!existsSync(ROOT)) {
  console.error('preview: build/client not found — run `npm run build` first.');
  exit(1);
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.map': 'application/json',
};

/** URL-путь → существующий файл в build/client (или null). */
function resolveFile(urlPath) {
  let pathname;
  try {
    pathname = decodeURIComponent(urlPath.split('?')[0]);
  } catch {
    return null;
  }
  // This is a static preview, never expose PHP source or hidden deployment credentials.
  if (pathname.split('/').some((part) => part.startsWith('.')) || /\.php$/i.test(pathname)) {
    return null;
  }
  const safe = normalize(pathname).replace(/^(\.\.[/\\])+/, '');
  const full = join(ROOT, safe);
  if (!full.startsWith(ROOT + sep) && full !== ROOT) return null;

  if (existsSync(full) && statSync(full).isFile()) return full;
  const index = join(full, 'index.html');
  if (existsSync(index) && statSync(index).isFile()) return index;
  return null;
}

createServer((req, res) => {
  const resolved = resolveFile(req.url ?? '/');
  const file = resolved ?? NOT_FOUND;
  const type = MIME[extname(file).toLowerCase()] ?? 'application/octet-stream';
  // Хешированные ассеты Vite можно кешировать навечно; HTML — нет.
  const cache = file.includes(`${sep}assets${sep}`)
    ? 'public, max-age=31536000, immutable'
    : 'no-cache';
  // Match production's mod_deflate so local transfer/performance checks are representative.
  const compressible = /^(text\/|application\/(json|xml)|image\/svg\+xml)/.test(type);
  const acceptsGzip = String(req.headers['accept-encoding'] ?? '')
    .split(',')
    .some((encoding) => {
      const [name, ...parameters] = encoding.trim().split(';');
      const quality = parameters.find((parameter) => parameter.trim().startsWith('q='));
      return name === 'gzip' && (!quality || Number(quality.trim().slice(2)) > 0);
    });
  const gzip = compressible && acceptsGzip;
  res.writeHead(resolved ? 200 : 404, {
    'Content-Type': type,
    'Cache-Control': cache,
    ...(compressible ? { Vary: 'Accept-Encoding' } : {}),
    ...(gzip ? { 'Content-Encoding': 'gzip' } : { 'Content-Length': statSync(file).size }),
  });
  if (req.method === 'HEAD') return res.end();
  const streams = [createReadStream(file), ...(gzip ? [createGzip()] : []), res];
  pipeline(...streams, (error) => {
    if (error && !res.destroyed) res.destroy(error);
  });
}).listen(PORT, HOST, () => {
  console.log(`preview: http://${HOST}:${PORT} → build/client`);
});
