// Скачивает self-hosted Google Sans с Google Fonts и генерирует @font-face.
// Один прогон: `node scripts/fetch-google-sans.mjs`.
// woff2 -> public/fonts/google-sans/, CSS -> src/app/styles/fonts.scss.
// Берём только сабсеты под RU/EN (latin, latin-ext, cyrillic, cyrillic-ext)
// и все начертания, которые отдаёт Google Fonts (веса 400-700 + italic).

import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = resolve(ROOT, 'public/fonts/google-sans');
const SCSS_OUT = resolve(ROOT, 'src/app/styles/fonts.scss');
const PUBLIC_PREFIX = '/fonts/google-sans';

const SUBSETS = ['latin', 'latin-ext', 'cyrillic', 'cyrillic-ext'];
// Полная матрица italic x вес — API отдаст только реально существующие комбинации.
const AXIS =
  '0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;' +
  '1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900';
const CSS_URL = `https://fonts.googleapis.com/css2?family=Google+Sans:ital,wght@${AXIS}&display=swap`;
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
  `google-sans-${f.weight.replace(/\s+/g, '-')}-${f.style}-${f.subset}.woff2`;

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
    const buf = Buffer.from(await (await fetch(f.url, { headers: { 'User-Agent': UA } })).arrayBuffer());
    await writeFile(resolve(OUT_DIR, file), buf);
    console.log(`  saved ${file} (${(buf.length / 1024).toFixed(1)} KB)  [${f.subset} ${f.weight} ${f.style}]`);
    blocks.push(
      `/* ${f.subset} */\n@font-face {\n` +
        `  font-family: 'Google Sans';\n` +
        `  font-weight: ${f.weight};\n` +
        `  font-style: ${f.style};\n\n` +
        `  font-display: swap;\n` +
        `  src: url('${PUBLIC_PREFIX}/${file}') format('woff2');\n` +
        (f.unicodeRange ? `  unicode-range: ${f.unicodeRange};\n` : '') +
        `}`,
    );
  }

  const header =
    '// СГЕНЕРИРОВАНО scripts/fetch-google-sans.mjs — вручную не править.\n' +
    '// Self-hosted Google Sans (woff2 в public/fonts/google-sans/).\n' +
    `// Сабсеты: ${SUBSETS.join(', ')}. Перегенерация: node scripts/fetch-google-sans.mjs\n\n`;
  await writeFile(SCSS_OUT, header + blocks.join('\n\n') + '\n');
  console.log(`-> wrote ${SCSS_OUT} (${blocks.length} @font-face)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
