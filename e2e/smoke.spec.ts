import { expect, test } from '@playwright/test';

test('home renders and navigates to portfolio', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

  await page.getByRole('link', { name: 'Портфолио' }).first().click();
  await expect(page).toHaveURL(/\/portfolio$/);
  await expect(page.getByRole('heading', { name: 'Портфолио' })).toBeVisible();
});

test('language switch navigates to the /en home', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'EN' }).click();
  await expect(page).toHaveURL(/\/en$/);
});
