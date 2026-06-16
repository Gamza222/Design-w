// Временный скрипт для скриншотов текущего состояния (не коммитить).
// ScrollSmoother транслирует контент transform-ом → fullPage не работает.
// Поэтому: скроллим к каждой секции и снимаем вьюпорт.
// Использование: node scripts/shot.mjs <outDir> [baseUrl]
import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const outDir = process.argv[2] ?? 'docs/tz-refs/.current';
const baseUrl = process.argv[3] ?? 'http://localhost:5173';
mkdirSync(outDir, { recursive: true });

const widths = [1920, 1440, 1280, 1024, 768, 390];
const browser = await chromium.launch();

for (const width of widths) {
  const height = width >= 1024 ? Math.round((width * 9) / 16) : width >= 768 ? 1024 : 844;
  const page = await browser.newPage({ viewport: { width, height } });
  await page.goto(baseUrl + '/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  // Позиции секций в потоке документа (до скролла transform = 0 → rect честный).
  const tops = await page.evaluate(() =>
    [...document.querySelectorAll('main section, main > div > section, section')]
      .filter((el) => el.getBoundingClientRect().height > 100)
      .map((el) => Math.max(0, el.getBoundingClientRect().top + window.scrollY - 80))
  );
  const stops = [0, ...tops.filter((t) => t > 50)];

  // Прогрев scroll-анимаций: медленно проходим страницу до конца.
  await page.evaluate(async () => {
    const total = document.body.scrollHeight;
    for (let y = 0; y <= total; y += 350) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 50));
    }
  });
  await page.waitForTimeout(800);

  for (let i = 0; i < stops.length; i++) {
    await page.evaluate((y) => window.scrollTo(0, y), stops[i]);
    await page.waitForTimeout(1100); // даём smoother-у доехать
    await page.screenshot({ path: `${outDir}/home-${width}-s${i}.png` });
  }
  console.log(`done ${width}: ${stops.length} stops`);
  await page.close();
}
await browser.close();
