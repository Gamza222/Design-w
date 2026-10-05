import { expect, test, type Locator } from './fixtures';

async function geometry(track: Locator) {
  return track.evaluate((element) => {
    const frame = element.getBoundingClientRect();
    const cards = Array.from(element.querySelectorAll('button')).map((card) =>
      card.getBoundingClientRect(),
    );
    const controls = element.nextElementSibling!.getBoundingClientRect();
    const counter = element.nextElementSibling!.querySelector('span')!.getBoundingClientRect();
    return {
      topSpace: Math.min(...cards.map((card) => card.top)) - frame.top,
      bottomSpace: frame.bottom - Math.max(...cards.map((card) => card.bottom)),
      controlGap: controls.top - Math.max(...cards.map((card) => card.bottom)),
      counterGap: counter.top - Math.max(...cards.map((card) => card.bottom)),
      overflow: document.documentElement.scrollWidth - window.innerWidth,
    };
  });
}

for (const width of [320, 390, 768, 1280, 1440, 1920]) {
  test(`services carousel separates cards, indicator and icons at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/#services');
    const section = page.locator('#services');
    const track = section.getByRole('group', { name: /Лента услуг/ });
    await track.scrollIntoViewIfNeeded();
    const before = await geometry(track);
    expect(before.overflow).toBeLessThanOrEqual(1);
    expect(before.topSpace).toBeGreaterThanOrEqual(18);
    expect(before.bottomSpace).toBeGreaterThanOrEqual(36);
    expect(before.controlGap).toBeGreaterThanOrEqual(36);
    expect(before.counterGap).toBeGreaterThanOrEqual(36);

    const sizes = await section.locator('[class*="perks"] > li svg').evaluateAll((icons) =>
      icons.map((icon) => ({
        width: icon.getBoundingClientRect().width,
        height: icon.getBoundingClientRect().height,
      })),
    );
    expect(sizes).toHaveLength(4);
    for (const size of sizes) {
      expect(size.width).toBeGreaterThanOrEqual(20);
      expect(size.height).toBeGreaterThanOrEqual(20);
    }

    const next = section.getByRole('button', { name: 'Следующие услуги' });
    await next.click();
    await expect.poll(() => track.evaluate((element) => element.scrollLeft)).toBeGreaterThan(100);
    await track.evaluate((element) =>
      element.scrollTo({ left: element.scrollWidth, behavior: 'instant' }),
    );
    await expect(next).toHaveAttribute('aria-disabled', 'true');
    await expect(section.locator('[class*="counter"]')).toHaveText('10 / 10');
    expect((await geometry(track)).controlGap).toBeGreaterThanOrEqual(36);
  });
}

test('hover and keyboard focus remain inside carousel vertical clearance', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/#services');
  await expect(page.locator('[class*="preloader"]')).toHaveCount(0);
  const track = page.locator('#services').getByRole('group', { name: /Лента услуг/ });
  await track.scrollIntoViewIfNeeded();
  await expect(track).toHaveCSS('opacity', '1');
  const card = track.getByRole('button').first();
  await card.hover();
  await expect(card).not.toHaveCSS('transform', 'none');
  const hovered = await geometry(track);
  expect(hovered.topSpace).toBeGreaterThanOrEqual(15);
  expect(hovered.bottomSpace).toBeGreaterThanOrEqual(36);
  expect(hovered.controlGap).toBeGreaterThanOrEqual(36);
  await card.focus();
  await expect(card).toBeFocused();
  expect((await geometry(track)).topSpace).toBeGreaterThanOrEqual(15);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(card).toHaveCSS('transform', 'none');
});

test('order dialog keeps real internal padding', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/#services');
  await page
    .locator('#services')
    .getByRole('button', { name: /Планировка.*1\s*500/ })
    .click();
  await page.getByRole('button', { name: 'Обсудить эту услугу' }).click();
  const dialog = page.getByRole('dialog', { name: 'Расскажите о вашем объекте' });
  await expect(dialog.getByLabel('Ваше имя')).toBeFocused();
  const padding = await dialog.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      top: parseFloat(style.paddingTop),
      left: parseFloat(style.paddingLeft),
      root: parseFloat(getComputedStyle(document.documentElement).fontSize),
    };
  });
  expect(padding.top).toBeGreaterThanOrEqual(1.5 * padding.root);
  expect(padding.left).toBeGreaterThanOrEqual(1.5 * padding.root);
});
