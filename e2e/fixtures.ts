import { test as base } from '@playwright/test';

export { expect, type Locator, type Page } from '@playwright/test';

// Test the site's map URL and layout without waiting for third-party map servers.
// Local JS, media, navigation and form requests remain unmodified.
export const test = base.extend<{ externalMaps: void }>({
  externalMaps: [
    async ({ context }, use) => {
      await context.route('https://yandex.ru/map-widget/**', (route) =>
        route.fulfill({
          contentType: 'text/html',
          body: '<!doctype html><html lang="ru"><title>Карта — тестовый ответ</title></html>',
        }),
      );
      // Проверяем локальную интеграцию, не отправляя тестовые визиты в живую Метрику.
      await context.route(/^https:\/\/mc\.yandex\.(ru|com)\//, (route) =>
        route.fulfill({ contentType: 'application/javascript', body: '' }),
      );
      await context.route('https://www.googletagmanager.com/**', (route) =>
        route.fulfill({ contentType: 'application/javascript', body: '' }),
      );
      await context.route(/^https:\/\/([^/]+\.)?google-analytics\.com\//, (route) =>
        route.fulfill({ status: 204 }),
      );
      await use();
    },
    { auto: true },
  ],
});
