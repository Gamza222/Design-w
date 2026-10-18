// Векторизует public/images/logo.png в ДВА гладких слоя и пишет src/shared/ui/Logo/paths.ts:
//   - полный силуэт (база)        -> LOGO_BASE_PATH (красится в тёмный — это и есть 3D-глубина)
//   - передняя грань (яркая верх.) -> LOGO_FACE_PATH (красится в акцент, рисуется поверх базы)
// «Тень»/экструзия = видимая разница двух КОНТУРОВ при наложении, а не отдельно обведённая
// тонкая полоса (та давала «бахрому»). Обе фигуры трассируются крупными и сглаженными, поэтому
// край ровный и чётче исходного PNG. Разделение яркое/тёмное — порогом Оцу.
// Нужны jimp+potrace (ставятся во временную папку).
// Запуск: LOGO_DEPS=/tmp/logo-trace-deps/node_modules node scripts/trace-logo.mjs

import { createRequire } from 'node:module';
import { writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const DEPS = process.env.LOGO_DEPS || '/tmp/logo-trace-deps/node_modules';
const Jimp = require(`${DEPS}/jimp`);
const { Potrace } = require(`${DEPS}/potrace`);

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = resolve(ROOT, 'public/images/logo.png');
const OUT = resolve(ROOT, 'src/shared/ui/Logo/paths.ts');

// Апскейл перед трассировкой: чем крупнее, тем глаже безье и меньше ступенек.
const UP = Number(process.env.LOGO_UPSCALE || 4);

const lum = (r, g, b) => 0.2126 * r + 0.7152 * g + 0.114 * b;
const isOpaque = (a, r, g, b) => a > 180 && !(r > 235 && g > 235 && b > 235);

// Порог Оцу по гистограмме яркости непрозрачных пикселей (делит яркую грань и тёмные бока).
function otsu(hist, total) {
  let sum = 0;
  for (let i = 0; i < 256; i++) sum += i * hist[i];
  let sumB = 0;
  let wB = 0;
  let maxVar = -1;
  let thr = 127;
  for (let i = 0; i < 256; i++) {
    wB += hist[i];
    if (wB === 0) continue;
    const wF = total - wB;
    if (wF === 0) break;
    sumB += i * hist[i];
    const mB = sumB / wB;
    const mF = (sum - sumB) / wF;
    const between = wB * wF * (mB - mF) * (mB - mF);
    if (between > maxVar) {
      maxVar = between;
      thr = i;
    }
  }
  return thr;
}

// Делит все координаты пути на factor (возврат из апскейла в исходный масштаб).
const scalePath = (d, factor) =>
  d.replace(/-?\d*\.?\d+/g, (n) => (parseFloat(n) / factor).toFixed(2));

// Чёрная маска (форма=0, фон=255) -> опц. блюр края -> potrace.
async function traceMask(big, pred, blur, opts) {
  const { width: w, height: h, data } = big.bitmap;
  const mask = await Jimp.create(w, h);
  for (let i = 0; i < data.length; i += 4) {
    const on = pred(data[i + 3], data[i], data[i + 1], data[i + 2]);
    const v = on ? 0 : 255;
    mask.bitmap.data[i] = mask.bitmap.data[i + 1] = mask.bitmap.data[i + 2] = v;
    mask.bitmap.data[i + 3] = 255;
  }
  if (blur) mask.blur(blur);
  const buf = await mask.getBufferAsync(Jimp.MIME_PNG);
  const d = await new Promise((res, rej) => {
    const tracer = new Potrace({
      threshold: 128,
      turnPolicy: Potrace.TURNPOLICY_MINORITY,
      alphaMax: 1,
      ...opts,
    });
    tracer.loadImage(buf, (err) => {
      if (err) return rej(err);
      const m = tracer.getPathTag().match(/ d="([^"]+)"/);
      if (m) res(m[1]);
      else rej(new Error('no path extracted'));
    });
  });
  return scalePath(d, UP);
}

async function main() {
  const orig = await Jimp.read(SRC);
  const w = orig.bitmap.width;
  const h = orig.bitmap.height;

  // Порог Оцу считаем на исходнике (без апскейла), по непрозрачным пикселям.
  const hist = new Array(256).fill(0);
  let opaque = 0;
  const od = orig.bitmap.data;
  for (let i = 0; i < od.length; i += 4) {
    const [r, g, b, a] = [od[i], od[i + 1], od[i + 2], od[i + 3]];
    if (!isOpaque(a, r, g, b)) continue;
    hist[Math.round(lum(r, g, b))]++;
    opaque++;
  }
  const T = otsu(hist, opaque);
  console.log(`-> ${w}x${h}, непрозрачных px: ${opaque}, порог Оцу: ${T}, апскейл x${UP}`);

  const big = orig.clone().resize(w * UP, h * UP, Jimp.RESIZE_BICUBIC);

  // База — весь силуэт: лёгкий блюр против ступенек, минимальный optTolerance (контур чёткий).
  const base = await traceMask(big, (a, r, g, b) => isOpaque(a, r, g, b), 2, {
    turdSize: 600,
    optTolerance: 0.35,
  });
  // Грань — яркая верхняя площадка: сильный блюр + большой optTolerance, чтобы внутренняя
  // граница «яркое/тёмное» (мягкая в исходнике) легла ровной кривой без волны.
  const face = await traceMask(
    big,
    (a, r, g, b) => isOpaque(a, r, g, b) && lum(r, g, b) >= T,
    13,
    { turdSize: 1600, optTolerance: 2.2 }
  );

  const out =
    '// СГЕНЕРИРОВАНО scripts/trace-logo.mjs из public/images/logo.png — вручную не править.\n' +
    `export const LOGO_VIEWBOX = '0 0 ${w} ${h}';\n\n` +
    `// Полный силуэт — база, красится в тёмный (3D-глубина). Рисуется первым.\n` +
    `export const LOGO_BASE_PATH =\n  '${base}';\n\n` +
    `// Передняя грань — яркая площадка (акцент). Рисуется поверх базы; разница и даёт экструзию.\n` +
    `export const LOGO_FACE_PATH =\n  '${face}';\n`;
  await writeFile(OUT, out);
  console.log(`-> wrote ${OUT}`);
  console.log(`   base d: ${base.length} симв., face d: ${face.length} симв.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
