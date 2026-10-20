import { expect, test, type Page } from './fixtures';

const COUNTER_ID = 113598335;
type MetrikaCall = [number, string, ...unknown[]];

async function metrikaCalls(page: Page): Promise<MetrikaCall[]> {
  return page.evaluate(() => {
    const analytics = window as Window & {
      ym?: { a?: IArguments[] };
    };
    return (analytics.ym?.a ?? []).map((args) => Array.from(args) as MetrikaCall);
  });
}

test.beforeEach(async ({ page }) => {
  // Keep the real site's queue and loader, but never send test visits to the counter.
  await page.route('https://mc.yandex.ru/**', (route) =>
    route.fulfill({ contentType: 'application/javascript', body: '' }),
  );
});

test('a direct inner-page visit initializes Metrika once and records the real URL', async ({
  page,
}) => {
  const referrer = 'https://www.google.com/';
  const response = await page.goto('/services/', { referer: referrer });
  expect(response?.status()).toBe(200);
  await expect(page.locator('[aria-controls="header-menu"]')).toBeEnabled();
  await expect.poll(async () => (await metrikaCalls(page)).length).toBe(2);

  expect(await metrikaCalls(page)).toEqual([
    [
      COUNTER_ID,
      'init',
      {
        defer: true,
        ssr: true,
        webvisor: true,
        clickmap: true,
        ecommerce: 'dataLayer',
        referrer,
        url: page.url(),
        accurateTrackBounce: true,
        trackLinks: true,
      },
    ],
    [COUNTER_ID, 'hit', page.url(), { referer: referrer, title: await page.title() }],
  ]);
  await expect(
    page.locator('script[src="https://mc.yandex.ru/metrika/tag.js?id=113598335"]'),
  ).toHaveCount(1);
});

test('SPA visits retain campaign attribution and track navigation and back without hash duplicates', async ({
  page,
}) => {
  const tagRequests: string[] = [];
  page.on('request', (request) => {
    if (request.url().startsWith('https://mc.yandex.ru/metrika/tag.js')) {
      tagRequests.push(request.url());
    }
  });
  await page.goto('/?utm_source=metrika-test&utm_campaign=interiors&yclid=123456');
  await expect(page.locator('[aria-controls="header-menu"]')).toBeEnabled();
  await expect.poll(async () => (await metrikaCalls(page)).length).toBe(2);
  const homeUrl = page.url();
  const homeTitle = await page.title();

  expect((await metrikaCalls(page))[1]).toEqual([
    COUNTER_ID,
    'hit',
    homeUrl,
    { referer: '', title: homeTitle },
  ]);

  // This is a real React Router footer link; using its DOM click avoids scroll animation.
  await page.locator('footer a[href="/privacy/"]').evaluate((link: HTMLAnchorElement) => {
    link.click();
  });
  await expect(page).toHaveURL(/\/privacy\/$/);
  await expect(page).toHaveTitle(/Политика конфиденциальности/);
  await expect.poll(async () => (await metrikaCalls(page)).length).toBe(3);
  const privacyUrl = page.url();
  expect((await metrikaCalls(page))[2]).toEqual([
    COUNTER_ID,
    'hit',
    privacyUrl,
    { referer: homeUrl, title: await page.title() },
  ]);

  await page.goBack();
  await expect(page).toHaveURL(homeUrl);
  await expect(page).toHaveTitle(homeTitle);
  await expect.poll(async () => (await metrikaCalls(page)).length).toBe(4);
  expect((await metrikaCalls(page))[3]).toEqual([
    COUNTER_ID,
    'hit',
    homeUrl,
    { referer: privacyUrl, title: homeTitle },
  ]);

  // Keep the query string unchanged: clearing UTM parameters is a different URL.
  await page.evaluate(() => {
    window.location.hash = 'about';
  });
  await expect(page).toHaveURL(`${homeUrl}#about`);
  await page.evaluate(
    () =>
      new Promise<void>((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
      }),
  );
  const calls = await metrikaCalls(page);
  expect(calls.filter((call) => call[1] === 'hit')).toHaveLength(3);
  expect(calls.filter((call) => call[1] === 'init')).toHaveLength(1);
  expect(tagRequests).toHaveLength(1);
});

test('the static 404 includes the loader and noscript counter and records the missing URL', async ({
  page,
}) => {
  const response = await page.goto('/metrika-missing-page/');
  expect(response?.status()).toBe(404);
  const html = await response!.text();
  expect(html).toMatch(/<script\b[^>]*\bsrc=["']\/metrika\.js(?:\?[^"']*)?["'][^>]*>/);
  expect(html).toMatch(
    /<noscript>[\s\S]*?<img\b[^>]*\bsrc=["']https:\/\/mc\.yandex\.ru\/watch\/113598335["'][\s\S]*?<\/noscript>/,
  );
  await expect.poll(async () => (await metrikaCalls(page)).length).toBe(2);
  expect((await metrikaCalls(page))[1]).toEqual([
    COUNTER_ID,
    'hit',
    page.url(),
    { referer: '', title: await page.title() },
  ]);
});
