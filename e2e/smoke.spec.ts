import { expect, test } from '@playwright/test';

test('home renders and navigates to portfolio', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

  await page.getByRole('link', { name: 'Портфолио' }).first().click();
  await expect(page).toHaveURL(/\/portfolio$/);
  await expect(page.getByRole('heading', { name: 'Портфолио' })).toBeVisible();
});

test('service SEO landing renders in all locales', async ({ page }) => {
  await page.goto('/planirovka-kvartiry');
  await expect(page.getByRole('heading', { level: 1, name: 'Планировка квартиры' })).toBeVisible();
  // Ключевые блоки посадки: карточка условий (цена) и FAQ-аккордеон.
  await expect(page.getByText('от 2 500 ₽/м²').first()).toBeVisible();
  await expect(page.getByRole('button', { name: /планировка отличается/i })).toBeVisible();

  await page.goto('/en/planirovka-kvartiry');
  await expect(page.getByRole('heading', { level: 1, name: 'Apartment layout' })).toBeVisible();

  await page.goto('/by/planirovka-kvartiry');
  await expect(page.getByRole('heading', { level: 1, name: 'Планіроўка кватэры' })).toBeVisible();
  await expect(page.getByText('ад 90 BYN/м²').first()).toBeVisible();
});

test('services hub links to the SEO landings', async ({ page }) => {
  await page.goto('/services');
  await page
    .getByRole('link', { name: /3D-визуализация интерьера/i })
    .first()
    .click();
  await expect(page).toHaveURL(/\/3d-vizualizaciya-interera$/);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

test('language switch navigates between country versions', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Язык сайта' }).click();
  await expect(page.getByRole('menuitem', { name: 'BY' })).toBeVisible();
  await page.getByRole('menuitem', { name: 'EN' }).click();
  await expect(page).toHaveURL(/\/en$/);
});

test('Belarus home uses BYN and exposes payment methods', async ({ page }) => {
  await page.goto('/by');
  await expect(page.locator('html')).toHaveAttribute('lang', 'be-BY');
  await expect(page.getByText('BYN/м²').first()).toBeVisible();

  await page.goto('/by/contact');
  await expect(page.getByText(/БЕЛКАРТ/).first()).toBeVisible();
});

test('header glass does not flicker around the scroll threshold', async ({ page }) => {
  await page.goto('/');

  const classChanges = await page.evaluate(async () => {
    const header = document.querySelector('header');
    if (!header) return -1;

    let changes = 0;
    const observer = new MutationObserver(() => {
      changes += 1;
    });
    observer.observe(header, { attributes: true, attributeFilter: ['class'] });

    for (let index = 0; index < 12; index += 1) {
      window.scrollTo(0, index % 2 === 0 ? 28 : 18);
      await new Promise((resolve) => setTimeout(resolve, 30));
    }

    observer.disconnect();
    return changes;
  });

  expect(classChanges).toBeGreaterThanOrEqual(1);
  expect(classChanges).toBeLessThanOrEqual(2);
});

test('unknown URL responds 404 with the static error page', async ({ page }) => {
  // Статичный 404.html: честный статус, без гидрации (см. scripts/generate-404.mjs).
  const response = await page.goto('/no-such-page');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { name: 'Страница не найдена' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'На главную' })).toBeVisible();
});
