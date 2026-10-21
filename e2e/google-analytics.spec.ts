import { expect, test } from './fixtures';

const tagUrl = 'https://www.googletagmanager.com/gtag/js?id=G-FGETKE5FZQ';

test('Google tag preserves the shared data layer and initializes once across SPA navigation', async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.assign(window, { dataLayer: [{ event: 'existing-ecommerce-data' }] });
  });
  await page.goto('/?utm_source=analytics-test');
  await expect(page.locator('[aria-controls="header-menu"]')).toBeEnabled();
  await expect(page.locator(`script[src="${tagUrl}"]`)).toHaveCount(1);
  await expect(page.locator(`script[src="${tagUrl}"]`)).toHaveAttribute('async', '');
  const readQueue = () =>
    page.evaluate(() => {
      const layer = (window as Window & { dataLayer?: unknown[] }).dataLayer ?? [];
      return layer.map((item) => {
        const value = item as { event?: string; length?: number };
        return typeof value.length === 'number' ? Array.from(item as IArguments) : item;
      });
    });
  const queue = await readQueue();
  expect(queue).toHaveLength(3);
  expect(queue[0]).toEqual({ event: 'existing-ecommerce-data' });
  expect((queue[1] as unknown[])[0]).toBe('js');
  expect(queue[2]).toEqual(['config', 'G-FGETKE5FZQ']);
  await page
    .locator('footer a[href="/privacy/"]')
    .evaluate((link: HTMLAnchorElement) => link.click());
  await expect(page).toHaveURL(/\/privacy\/$/);
  expect(await readQueue()).toEqual(queue);
  await page.goBack();
  await expect(page).toHaveURL(/\?utm_source=analytics-test$/);
  expect(await readQueue()).toEqual(queue);
  await expect(page.locator('script#google-analytics-init')).toHaveCount(1);
});

test('Google tag also initializes on the static 404', async ({ page }) => {
  const response = await page.goto('/google-analytics-missing-page/');
  expect(response?.status()).toBe(404);
  await expect(page.locator(`script[src="${tagUrl}"]`)).toHaveCount(1);
  const calls = await page.evaluate(() => {
    const layer = (window as Window & { dataLayer?: IArguments[] }).dataLayer ?? [];
    return layer.map((item) => Array.from(item));
  });
  expect(calls).toHaveLength(2);
  expect(calls[1]).toEqual(['config', 'G-FGETKE5FZQ']);
});
