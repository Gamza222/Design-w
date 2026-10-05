import { expect, test } from './fixtures';

const locales = [
  { path: '/', calculate: 'Рассчитать проект', theme: 'Светлая тема' },
  { path: '/en/', calculate: 'Get an estimate', theme: 'Light theme' },
  { path: '/by/', calculate: 'Разлічыць праект', theme: 'Светлая тэма' },
] as const;

for (const locale of locales) {
  test(`enquiry opens without navigation and preserves attribution in ${locale.path}`, async ({
    page,
  }) => {
    let payload: Record<string, unknown> | undefined;
    await page.route('**/api/lead.php', async (route) => {
      payload = route.request().postDataJSON();
      await route.fulfill({ json: { ok: true, leadNumber: 'ABCD23456', requestId: 'ABCD23456' } });
    });
    await page.goto(`${locale.path}?utm_source=release-test&utm_campaign=interiors`);
    const trigger = page
      .locator('main')
      .getByRole('button', { name: locale.calculate, exact: true })
      .first();
    await trigger.scrollIntoViewIfNeeded();
    const scroll = await page.evaluate(() => scrollY);
    const url = page.url();
    await trigger.click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    expect(page.url()).toBe(url);
    expect(Math.abs((await page.evaluate(() => scrollY)) - scroll)).toBeLessThanOrEqual(1);
    await expect(dialog.locator('input[name="name"]')).toBeFocused();
    await expect(page.locator('body')).toHaveCSS('overflow', 'hidden');
    await dialog.locator('button[type="submit"]').click();
    await expect(dialog.locator('input[name="name"]')).toHaveAttribute('aria-invalid', 'true');
    await dialog.locator('input[name="name"]').fill('Тест интерфейса');
    await dialog.locator('input[name="phone"]').fill('+7 999 123 45 67');
    await dialog.getByRole('checkbox').focus();
    await page.keyboard.press('Space');
    await expect(dialog.getByRole('checkbox')).toBeChecked();
    await dialog.locator('button[type="submit"]').click();
    await expect(dialog.getByRole('status')).toContainText('ABCD23456');
    expect(payload).toMatchObject({
      consent: true,
      context: { source: 'hero' },
      attribution: { utm_source: 'release-test', utm_campaign: 'interiors' },
    });
    await page.keyboard.press('Escape');
    await expect(dialog).toHaveCount(0);
    await expect(trigger).toBeFocused();
    await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden');
  });

  for (const width of [360, 768, 1366, 1920]) {
    test(`themes persist without hydration errors at ${width}px ${locale.path}`, async ({
      page,
    }) => {
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      await page.setViewportSize({ width, height: 900 });
      await page.goto(locale.path);
      const toggle = page.getByRole('button', { name: locale.theme, exact: true });
      await expect(toggle).toHaveAttribute('aria-pressed', 'false');
      await toggle.click();
      await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
      await expect(toggle).toHaveAttribute('aria-pressed', 'true');
      await page.reload();
      await expect(toggle).toHaveAttribute('aria-pressed', 'true');
      for (const theme of ['light', 'dark']) {
        if (theme === 'dark') await toggle.click();
        await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
        expect(
          await page.evaluate(() => document.documentElement.scrollWidth - innerWidth),
        ).toBeLessThanOrEqual(1);
        const brokenImages = await page
          .locator('img')
          .evaluateAll((images: HTMLImageElement[]) =>
            images
              .filter((image) => image.complete && image.naturalWidth === 0)
              .map((image) => image.src),
          );
        expect(brokenImages).toEqual([]);
      }
      expect(errors).toEqual([]);
    });
  }
}

test('calculator retains price, area and separate monthly services through submission', async ({
  page,
}) => {
  let payload: Record<string, unknown> | undefined;
  await page.route('**/api/lead.php', async (route) => {
    payload = route.request().postDataJSON();
    await route.fulfill({ json: { ok: true, leadNumber: 'ABCD23456' } });
  });
  await page.goto('/#calculator');
  const calculator = page.locator('#calculator');
  await calculator.getByRole('button', { name: /Чертежи 2\s*000/ }).click();
  const area = calculator.getByRole('textbox', { name: /Укажите площадь/ });
  await area.fill('80');
  await area.press('Tab');
  await calculator.getByRole('button', { name: /Авторский надзор/ }).click();
  await calculator.getByRole('button', { name: /Комплектация/ }).click();
  await calculator.getByRole('button', { name: /3D-визуализаци/ }).click();
  await expect(calculator.getByText('от 240 000 ₽', { exact: true })).toBeVisible();
  const trigger = calculator.getByRole('button', { name: /Получить точную стоимость/ });
  await trigger.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toContainText('80 м²');
  await expect(dialog).toContainText(/240\s*000/);
  await expect(dialog.locator('select')).toHaveCount(0);
  await dialog.locator('input[name="name"]').fill('Тест расчёта');
  await dialog.locator('input[name="phone"]').fill('+7 999 123 45 67');
  await dialog.getByRole('checkbox').focus();
  await page.keyboard.press('Space');
  await expect(dialog.getByRole('checkbox')).toBeChecked();
  await dialog.locator('button[type="submit"]').click();
  await expect(dialog.getByRole('status')).toContainText('ABCD23456');
  expect(payload).toMatchObject({
    context: {
      packageId: 'drawings',
      area: 80,
      estimate: 240000,
      currency: 'RUB',
      preliminary: true,
    },
  });
  const context = payload?.context as { extras: string[] };
  expect(context.extras.some((extra) => extra.includes('30') && /месяц/.test(extra))).toBe(true);
  expect(context.extras.some((extra) => extra.includes('Комплектация'))).toBe(true);
});

test('case FAQ, gallery and contextual enquiry work on a narrow phone', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 780 });
  await page.goto('/portfolio/minimal-loft/');
  await expect(page.locator('main article')).toHaveCount(1);
  const images = await page
    .locator('main article img')
    .evaluateAll((elements: HTMLImageElement[]) => elements.map((image) => image.src));
  expect(new Set(images).size).toBe(images.length);
  const question = page.locator('main article button[aria-expanded]').first();
  await question.click();
  await expect(question).toHaveAttribute('aria-expanded', 'true');
  await page
    .locator('main article')
    .getByRole('button', { name: /Обсудить|Оставить|проект/i })
    .last()
    .click();
  await expect(page.getByRole('dialog')).toBeVisible();
});
