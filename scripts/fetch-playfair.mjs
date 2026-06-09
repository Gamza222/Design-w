// Скачивает self-hosted Playfair Display с Google Fonts и генерирует @font-face.
// Один прогон: `node scripts/fetch-playfair.mjs`.
// woff2 -> public/fonts/playfair/, CSS -> src/app/styles/fonts-playfair.scss.
// Display-serif для заголовков (--font-display). Кириллица обязательна (сайт RU-first):
// берём сабсеты latin, latin-ext, cyrillic, cyrillic-ext, веса 400-700 (normal).

import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = resolve(ROOT, 'public/fonts/playfair');
const SCSS_OUT = resolve(ROOT, 'src/app/styles/fonts-playfair.scss');
const PUBLIC_PREFIX = '/fonts/playfair';
const FAMILY = 'Playfair Display';
const FILE_BASE = 'playfair';

const SUBSETS = ['latin', 'latin-ext', 'cyrillic', 'cyrillic-ext'];
// Только normal; заголовкам italic не нужен. Веса 400-700 — реально существующие отдаст API.
const AXIS = '0,400;0,500;0,600;0,700';
const CSS_URL = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
  FAMILY,
).replace(/%20/g, '+')}:ital,wght@${AXIS}&display=swap`;
// woff2-вариант отдаётся только «браузерному» UA.
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36';

// Разбирает CSS Google Fonts: блоки @font-face и их сабсет-комментарии.
function parseFaces(css) {
  const re = /\/\*\s*([\w-]+)\s*\*\/\s*@font-face\s*{([^}]*)}/g;
  const faces = [];
  let m;
  while ((m = re.exec(css)) !== null) {
    const subset = m[1];
    const body = m[2];
    const pick = (name) => (body.match(new RegExp(`${name}:\\s*([^;]+);`)) || [])[1]?.trim();
    const url = (body.match(/url\(([^)]+)\)/) || [])[1];
    faces.push({
      subset,
      style: pick('font-style') || 'normal',
      weight: pick('font-weight') || '400',
      unicodeRange: pick('unicode-range') || '',
      url,
    });
  }
  return faces;
}

const fileNameFor = (f) =>
  `${FILE_BASE}-${f.weight.replace(/\s+/g, '-')}-${f.style}-${f.subset}.woff2`;

async function main() {
  console.log('-> fetch CSS:', CSS_URL);
  const res = await fetch(CSS_URL, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`CSS request failed: HTTP ${res.status}`);
  const css = await res.text();

  const faces = parseFaces(css).filter((f) => SUBSETS.includes(f.subset));
  if (faces.length === 0) throw new Error('No matching @font-face blocks parsed.');

  console.log(`-> ${faces.length} faces across subsets ${SUBSETS.join(', ')}`);
  await mkdir(OUT_DIR, { recursive: true });

  const blocks = [];
  for (const f of faces) {
    const file = fileNameFor(f);
    const buf = Buffer.from(
      await (await fetch(f.url, { headers: { 'User-Agent': UA } })).arrayBuffer(),
    );
    await writeFile(resolve(OUT_DIR, file), buf);
    console.log(`  saved ${file} (${(buf.length / 1024).toFixed(1)} KB)  [${f.subset} ${f.weight} ${f.style}]`);
    blocks.push(
      `/* ${f.subset} */\n@font-face {\n` +
        `  font-family: '${FAMILY}';\n` +
        `  font-weight: ${f.weight};\n` +
        `  font-style: ${f.style};\n\n` +
        `  font-display: swap;\n` +
        `  src: url('${PUBLIC_PREFIX}/${file}') format('woff2');\n` +
        (f.unicodeRange ? `  unicode-range: ${f.unicodeRange};\n` : '') +
        `}`,
    );
  }

  const header =
    '// СГЕНЕРИРОВАНО scripts/fetch-playfair.mjs — вручную не править.\n' +
    `// Self-hosted ${FAMILY} (woff2 в public/fonts/${FILE_BASE}/) — display-serif для заголовков.\n` +
    `// Сабсеты: ${SUBSETS.join(', ')}. Перегенерация: node scripts/fetch-playfair.mjs\n\n`;
  await writeFile(SCSS_OUT, header + blocks.join('\n\n') + '\n');
  console.log(`-> wrote ${SCSS_OUT} (${blocks.length} @font-face)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
