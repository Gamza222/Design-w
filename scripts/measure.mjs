// Временный замер: помещается ли первый экран (Hero + лента пакетов) в вьюпорт при scroll=0.
// Ждём завершения GSAP-reveal панели (delay 1.5 + dur 0.8 ≈ 2.3с), меряем низ самого нижнего
// элемента ленты (карточки тарифов / калькулятор / кнопка интро) относительно innerHeight.
import { chromium } from '@playwright/test';

const baseUrl = process.argv[2] ?? 'http://localhost:3000';
const sizes = [
  [1920, 1080], [1728, 1117], [1680, 1050], [1600, 900],
  [1536, 864], [1512, 982], [1456, 816], [1440, 900], [1440, 810], [1366, 768],
];
const browser = await chromium.launch();
for (const [w, h] of sizes) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.goto(baseUrl + '/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000); // дождаться окончания reveal
  const data = await page.evaluate(() => {
    const vh = window.innerHeight;
    const texts = ['СТАРТ', 'КОМФОРТ', 'ПОЛНЫЙ', 'Нужен расчёт', 'Подобрать пакет'];
    let maxBottom = 0;
    let labelAtMax = '';
    for (const el of document.querySelectorAll('*')) {
      const t = (el.childElementCount === 0 ? el.textContent : '') || '';
      for (const key of texts) {
        if (t.trim() === key || (key === 'Нужен расчёт' && /Нужен расчёт/.test(t))) {
          const card = el.closest('article,div,a') || el;
          const b = Math.round(card.getBoundingClientRect().bottom);
          if (b > maxBottom) { maxBottom = b; labelAtMax = key; }
        }
      }
    }
    return { vh, maxBottom, labelAtMax };
  });
  const over = data.maxBottom - data.vh;
  console.log(
    `${String(w).padStart(4)}x${String(h).padStart(4)}  vh=${data.vh}  lowest=${data.maxBottom} (${data.labelAtMax})  ` +
      `=> ${over > 0 ? 'CUT OFF by ' + over + 'px' : 'fits, ' + -over + 'px to fold'}`
  );
  await page.close();
}
await browser.close();
