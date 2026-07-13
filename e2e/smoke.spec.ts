import { expect, test } from '@playwright/test';

test('home renders and navigates to portfolio', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

  await page.getByRole('link', { name: 'Портфолио' }).first().click();
  await expect(page).toHaveURL(/\/portfolio$/);
  await expect(page.getByRole('heading', { name: 'Портфолио' })).toBeVisible();
});

test('service SEO landing renders (both locales)', async ({ page }) => {
  await page.goto('/planirovka-kvartiry');
  await expect(page.getByRole('heading', { level: 1, name: 'Планировка квартиры' })).toBeVisible();
  // Ключевые блоки посадки: карточка условий (цена) и FAQ-аккордеон.
  await expect(page.getByText('от 2 500 ₽/м²').first()).toBeVisible();
  await expect(page.getByRole('button', { name: /планировка отличается/i })).toBeVisible();

  await page.goto('/en/planirovka-kvartiry');
  await expect(page.getByRole('heading', { level: 1, name: 'Apartment layout' })).toBeVisible();
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

test('language switch navigates to the /en home', async ({ page }) => {
  await page.goto('/');
  // Переключатель языка — дропдаун: открыть триггер «Language», затем выбрать EN.
  await page.getByRole('button', { name: 'Language' }).click();
  await page.getByRole('menuitem', { name: 'EN' }).click();
  await expect(page).toHaveURL(/\/en$/);
});
