// Re-encode the studio's existing project photographs without changing framing or resolution.
// Requires cwebp (libwebp). JPEG sources remain available, including social-sharing previews.
import { readdir, stat } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const directory = fileURLToPath(new URL('../public/realimages/web/', import.meta.url));
let before = 0;
let after = 0;
for (const name of (await readdir(directory)).filter((file) => file.endsWith('.jpg')).sort()) {
  const source = join(directory, name);
  const target = source.replace(/\.jpg$/, '.webp');
  execFileSync('cwebp', ['-quiet', '-q', '86', '-m', '6', source, '-o', target]);
  before += (await stat(source)).size;
  after += (await stat(target)).size;
}
console.log(`Project photos: ${(before / 1024).toFixed(0)} → ${(after / 1024).toFixed(0)} KiB`);
