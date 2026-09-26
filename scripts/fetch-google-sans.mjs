// Скачивает self-hosted Google Sans с Google Fonts и генерирует @font-face.
// Один прогон: `node scripts/fetch-google-sans.mjs`.
// woff2 -> public/fonts/google-sans/, CSS -> src/app/styles/fonts.scss.
// Берём сабсеты под RU/EN/BE (latin, latin-ext, cyrillic, cyrillic-ext)
// и по одному variable-файлу 400–700 для normal/italic в каждом сабсете.

import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = resolve(ROOT, 'public/fonts/google-sans');
const SCSS_OUT = resolve(ROOT, 'src/app/styles/fonts.scss');
const PUBLIC_PREFIX = '/fonts/google-sans';

const SUBSETS = ['latin', 'latin-ext', 'cyrillic', 'cyrillic-ext'];
// Диапазон оси исключает одинаковые копии variable-font для каждого отдельного веса.
const AXIS = '0,400..700;1,400..700';
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

// Сохраняем существующие пути: файлы с историческим «400» содержат всю ось 400–700.
const fileNameFor = (f) => `google-sans-400-${f.style}-${f.subset}.woff2`;

async function main() {
  console.log('-> fetch CSS:', CSS_URL);
  const res = await fetch(CSS_URL, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`CSS request failed: HTTP ${res.status}`);
  const css = await res.text();

  const faces = parseFaces(css).filter((f) => SUBSETS.includes(f.subset));
  const expectedFaces = new Set(
    SUBSETS.flatMap((subset) => ['normal', 'italic'].map((style) => `${subset}:${style}`)),
  );
  for (const face of faces) {
    if (face.weight !== '400 700' || !expectedFaces.delete(`${face.subset}:${face.style}`)) {
      throw new Error('Expected one variable 400–700 face per subset and style.');
    }
  }
  if (expectedFaces.size > 0) throw new Error('Google Fonts did not return every required face.');

  console.log(`-> ${faces.length} faces across subsets ${SUBSETS.join(', ')}`);
  await mkdir(OUT_DIR, { recursive: true });

  // Download and validate every face before replacing any checked-in font.
  const downloads = await Promise.all(
    faces.map(async (face) => {
      const response = await fetch(face.url, { headers: { 'User-Agent': UA } });
      if (!response.ok) throw new Error(`Font request failed: HTTP ${response.status}`);
      const buffer = Buffer.from(await response.arrayBuffer());
      if (buffer.toString('ascii', 0, 4) !== 'wOF2') throw new Error('Expected a WOFF2 font file.');
      return { face, buffer, file: fileNameFor(face) };
    }),
  );
  await Promise.all(downloads.map(({ file, buffer }) => writeFile(resolve(OUT_DIR, file), buffer)));

  const blocks = downloads.map(({ face: f, buffer, file }) => {
    console.log(
      `  saved ${file} (${(buffer.length / 1024).toFixed(1)} KB)  [${f.subset} ${f.weight} ${f.style}]`,
    );
    return (
      `/* ${f.subset} */\n@font-face {\n` +
      `  font-family: 'Google Sans';\n` +
      `  font-weight: ${f.weight};\n` +
      `  font-style: ${f.style};\n\n` +
      `  font-display: swap;\n` +
      `  src: url('${PUBLIC_PREFIX}/${file}') format('woff2');\n` +
      (f.unicodeRange ? `  unicode-range: ${f.unicodeRange};\n` : '') +
      `}`
    );
  });

  const header =
    '// СГЕНЕРИРОВАНО scripts/fetch-google-sans.mjs — вручную не править.\n' +
    '// Self-hosted Google Sans (woff2 в public/fonts/google-sans/).\n' +
    '// Variable 400–700: один файл на начертание и сабсет; существующие пути сохранены.\n' +
    `// Сабсеты: ${SUBSETS.join(', ')}. Перегенерация: node scripts/fetch-google-sans.mjs\n\n`;
  await writeFile(SCSS_OUT, header + blocks.join('\n\n') + '\n');
  console.log(`-> wrote ${SCSS_OUT} (${blocks.length} @font-face)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
