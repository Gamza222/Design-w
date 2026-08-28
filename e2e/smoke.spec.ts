import { expect, test } from '@playwright/test';

const layoutRoutes = [
  '/',
  '/services',
  '/planirovka-kvartiry',
  '/3d-vizualizaciya-interera',
  '/eskiznyj-dizajn-proekt',
  '/portfolio',
  '/portfolio/minimal-loft',
  '/blog',
  '/blog/natural-light',
  '/about',
  '/contact',
  '/privacy',
  '/offer',
  '/requisites',
  '/consent',
  '/en',
  '/by',
] as const;

const layoutViewports = [360, 768, 1024, 1280, 1440, 1920, 2560, 3840] as const;

for (const width of layoutViewports) {
  test(`all page sections share one content rail at ${width}px`, async ({ page }) => {
    test.setTimeout(120_000);
    await page.setViewportSize({ width, height: 900 });

    for (const route of layoutRoutes) {
      const response = await page.goto(route, { waitUntil: 'domcontentloaded' });
      expect(response?.status(), `${route} must render successfully`).toBeLessThan(400);

      const metrics = await page.evaluate(() => {
        const containers = Array.from(
          document.querySelectorAll<HTMLElement>('[data-layout-container]'),
        )
          .map((element) => {
            const rect = element.getBoundingClientRect();
            const style = getComputedStyle(element);

            return {
              left: rect.left + Number.parseFloat(style.paddingLeft),
              right: rect.right - Number.parseFloat(style.paddingRight),
              width: rect.width,
            };
          })
          .filter((rect) => rect.width > 0);

        const leftEdges = containers.map(({ left }) => left);
        const rightEdges = containers.map(({ right }) => right);

        return {
          count: containers.length,
          leftDelta: Math.max(...leftEdges) - Math.min(...leftEdges),
          rightDelta: Math.max(...rightEdges) - Math.min(...rightEdges),
          overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        };
      });

      expect(metrics.count, `${route} must use shared layout containers`).toBeGreaterThan(1);
      expect(metrics.leftDelta, `${route} left content rail`).toBeLessThanOrEqual(1);
      expect(metrics.rightDelta, `${route} right content rail`).toBeLessThanOrEqual(1);
      expect(metrics.overflow, `${route} horizontal overflow`).toBeLessThanOrEqual(1);
    }
  });
}

test('header navigation moves between home sections without opening separate pages', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

  await page.getByRole('link', { name: 'Портфолио' }).first().click();
  await expect(page).toHaveURL(/\/#portfolio$/);
  await expect(page.locator('#portfolio')).toBeInViewport();

  await page.goto('/contact');
  await page.getByRole('link', { name: 'Услуги' }).first().click();
  await expect(page).toHaveURL(/\/#services$/);
  await expect(page.locator('#services')).toBeInViewport();
});

test('service SEO landing renders in all locales', async ({ page }) => {
  await page.goto('/planirovka-kvartiry');
  await expect(page.getByRole('heading', { level: 1, name: 'Планировка квартиры' })).toBeVisible();
  // Ключевые блоки посадки: карточка условий (цена) и FAQ-аккордеон.
  await expect(page.getByText('от 1 500 ₽/м²').first()).toBeVisible();
  await expect(page.getByRole('button', { name: /планировка отличается/i })).toBeVisible();

  await page.goto('/en/planirovka-kvartiry');
  await expect(page.getByRole('heading', { level: 1, name: 'Apartment layout' })).toBeVisible();

  await page.goto('/by/planirovka-kvartiry');
  await expect(page.getByRole('heading', { level: 1, name: 'Планіроўка кватэры' })).toBeVisible();
  await expect(page.getByText('ад 55 BYN/м²').first()).toBeVisible();
});

test('service order opens the full form with the selected package', async ({ page }) => {
  await page.goto('/#services');
  await page.getByRole('button', { name: /Планировка квартиры.*1\s*500\s*₽\/м²/i }).click();

  const offerDialog = page.getByRole('dialog', { name: 'Планировка квартиры' });
  await expect(offerDialog).toBeVisible();
  await offerDialog.getByRole('button', { name: 'Заказать этот пакет' }).click();

  const formDialog = page.getByRole('dialog', { name: 'Расскажите о вашем объекте' });
  await expect(formDialog).toBeVisible();
  await expect(formDialog.getByLabel('Пакет или услуга')).toHaveValue('planning');

  await formDialog.getByLabel('Ваше имя').fill('Анна');
  await formDialog.getByLabel('Телефон').fill('+7 999 123-45-67');
  await formDialog.getByLabel('Тип помещения').selectOption('apartment');
  await formDialog.getByLabel('Площадь объекта (м²)').fill('72');
  await formDialog
    .getByText('Соглашаюсь с обработкой персональных данных', { exact: true })
    .click();
  await formDialog.getByRole('button', { name: 'Обсудить проект' }).click();
  await expect(formDialog.getByText(/Спасибо! Мы свяжемся/)).toBeVisible();
});

test('calculator includes bundled 3D once and changes the timeline with the format', async ({
  page,
}) => {
  await page.goto('/#calculator');
  const calculator = page.locator('#calculator');

  const bundled3d = calculator.getByRole('button', {
    name: /3D-визуализация Включено в пакет/i,
  });
  await expect(bundled3d).toHaveAttribute('aria-pressed', 'true');
  await expect(bundled3d).toBeDisabled();
  await expect(calculator.getByText('от 10 дней', { exact: true })).toBeVisible();
  await expect(calculator.getByText('216 000 ₽', { exact: true })).toBeVisible();

  await calculator.getByRole('button', { name: /^01.*Планировка.*1\s*500\s*₽\/м²/i }).click();
  await expect(calculator.getByText('от 2 дней', { exact: true })).toBeVisible();
  await expect(calculator.getByText('108 000 ₽', { exact: true })).toBeVisible();
  await expect(
    calculator.getByRole('button', { name: /3D-визуализация \+ 1 000 ₽\/м²/i }),
  ).toBeEnabled();
});

test('footer contains the Yandex map and the cookie notice can be acknowledged', async ({
  page,
}) => {
  await page.goto('/');
  const map = page.locator('iframe[src^="https://yandex.ru/map-widget/v1/"]');
  await expect(map).toHaveAttribute('loading', 'lazy');
  await expect(map).toHaveAttribute('src', /mode=whatshere/);

  const notice = page.getByLabel('Файлы cookie');
  await expect(notice).toBeVisible();
  await notice.getByRole('button', { name: 'Понятно' }).click();
  await expect(notice).toBeHidden();
  await page.reload();
  await expect(notice).toBeHidden();
});

test('mobile home has no horizontal overflow and its menu uses section anchors', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  const width = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth,
  }));
  expect(width.content).toBe(width.viewport);

  await page.getByRole('button', { name: 'Меню' }).click();
  const services = page.getByRole('link', { name: 'Услуги', exact: true }).first();
  await expect(services).toBeVisible();
  await services.click();
  await expect(page).toHaveURL(/\/#services$/);
  await expect(page.locator('#services')).toBeInViewport();
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

  const localeCookie = (await page.context().cookies()).find(
    (cookie) => cookie.name === 'tdn_locale',
  );
  expect(localeCookie?.value).toBe('en');
});

test('published contacts and external channels are linked', async ({ page }) => {
  await page.goto('/contact');
  await expect(page.getByRole('link', { name: '+7 (915) 114-24-99' }).first()).toHaveAttribute(
    'href',
    'tel:+79151142499',
  );
  await expect(
    page.getByRole('link', { name: 'dizain.seichas@yandex.ru' }).first(),
  ).toHaveAttribute('href', 'mailto:dizain.seichas@yandex.ru');
  await expect(
    page.getByText('Москва, ул. Большой Каретный переулок д. 22, ст. 3').first(),
  ).toBeVisible();
  await expect(page.getByRole('link', { name: 'VK' }).first()).toHaveAttribute(
    'href',
    'https://vk.ru/club240967161',
  );

  await page.goto('/#blog');
  await expect(page.locator('a[href^="https://dzen.ru/disainseichas"]').first()).toHaveAttribute(
    'target',
    '_blank',
  );
  await expect(page.locator('a[href^="https://dzen.ru/a/"]').first()).toHaveAttribute(
    'target',
    '_blank',
  );
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
