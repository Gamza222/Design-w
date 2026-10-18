import { expect, test } from './fixtures';

for (const path of ['/contact', '/#services-request']) {
  test(`form waits for its handlers before accepting input at ${path}`, async ({ page }) => {
    let releaseScripts = () => {};
    const scriptsReady = new Promise<void>((resolve) => {
      releaseScripts = resolve;
    });
    await page.route('**/assets/*.js', async (route) => {
      await scriptsReady;
      await route.continue();
    });
    await page.goto(path, { waitUntil: 'commit' });
    const form = page.locator(path === '/contact' ? 'main form' : '#services-request form');
    const name = form.getByLabel('Ваше имя');
    try {
      await expect(name).toBeDisabled();
      await expect(form.locator('button[type="submit"]')).toBeDisabled();
    } finally {
      releaseScripts();
    }
    await expect(name).toBeEnabled();
    await name.fill('Мария');
    await form.getByLabel('Телефон').fill('+7 999 123-45-67');
    await expect(name).toHaveValue('Мария');
  });
}
