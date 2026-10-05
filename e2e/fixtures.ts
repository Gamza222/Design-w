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
      await use();
    },
    { auto: true },
  ],
});
