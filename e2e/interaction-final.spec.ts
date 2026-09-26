import { expect, test, type Locator, type Page } from '@playwright/test';

async function fillProjectForm(form: Locator) {
  await form.getByLabel('Ваше имя').fill('Анна');
  await form.getByLabel('Телефон').fill('+7 999 123-45-67');
  await form.getByLabel('Тип помещения').selectOption('apartment');
  await form.getByLabel('Площадь объекта (м²)').fill('72');
  await form.getByLabel('Пакет или услуга').selectOption('planning');
  await form.getByText('Соглашаюсь с обработкой персональных данных', { exact: true }).click();
}

async function openOrder(page: Page) {
  await page.goto('/#services');
  const trigger = page.getByRole('button', { name: /Планировка квартиры.*1\s*500\s*₽\/м²/i });
  await trigger.click();
  await page
    .getByRole('dialog', { name: 'Планировка квартиры' })
    .getByRole('button', { name: 'Заказать этот пакет' })
    .click();
  return { dialog: page.getByRole('dialog', { name: 'Расскажите о вашем объекте' }), trigger };
}

for (const kind of ['consultation', 'project'] as const) {
  test(`${kind} locks pending inputs, safely retries, and delivers edited details as a new submission`, async ({
    page,
  }) => {
    const requests: Record<string, unknown>[] = [];
    let releaseFirst: () => void = () => {};
    const firstResponse = new Promise<void>((resolve) => {
      releaseFirst = resolve;
    });
    await page.route('**/api/lead.php', async (route) => {
      requests.push(route.request().postDataJSON());
      const attempt = requests.length;
      if (attempt === 1) await firstResponse;
      await route.fulfill({
        status: attempt === 3 ? 200 : 502,
        contentType: 'application/json',
        body: JSON.stringify({ ok: attempt === 3 }),
      });
    });

    await page.goto(kind === 'project' ? '/contact' : '/#services-request');
    const form =
      kind === 'project' ? page.locator('main form') : page.locator('#services-request form');
    if (kind === 'project') {
      await fillProjectForm(form);
    } else {
      await form.getByLabel('Ваше имя').fill('Анна');
      await form.getByLabel('Телефон').fill('+7 999 123-45-67');
      await form.getByText('Соглашаюсь с обработкой персональных данных', { exact: true }).click();
    }
    const submit = form.locator('button[type="submit"]');
    await submit.click();
    await expect(submit).toBeDisabled();
    await expect(form.getByLabel('Ваше имя')).toBeDisabled();
    await expect(form.getByLabel('Телефон')).toBeDisabled();
    await form.evaluate((element: HTMLFormElement) => element.requestSubmit());
    await expect.poll(() => requests.length).toBe(1);
    releaseFirst();

    await expect(form.getByText(/Не удалось отправить заявку/)).toBeVisible();
    await submit.click();
    await expect(form.getByText(/Не удалось отправить заявку/)).toBeVisible();
    expect(requests[1]?.submissionId).toBe(requests[0]?.submissionId);

    await form.getByLabel('Ваше имя').fill('Анна — исправленная заявка');
    await submit.click();
    await expect(page.getByText(/Спасибо! Мы свяжемся/)).toBeVisible();
    expect(requests).toHaveLength(3);
    expect(requests[2]?.submissionId).not.toBe(requests[1]?.submissionId);
    expect(requests[2]?.name).toBe('Анна — исправленная заявка');
  });
}

test('order dialog keeps keyboard focus inside during validation and after success', async ({
  page,
}) => {
  await page.route('**/api/lead.php', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' }),
  );
  const { dialog, trigger } = await openOrder(page);
  const close = dialog.getByRole('button', { name: /закрыть/i });
  await expect(dialog.getByLabel('Ваше имя')).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(close).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(dialog.getByLabel('Ваше имя')).toBeFocused();
  await dialog.getByRole('button', { name: 'Обсудить проект' }).click();
  await expect(dialog.getByLabel('Ваше имя')).toBeFocused();
  await fillProjectForm(dialog);
  await dialog.getByRole('button', { name: 'Обсудить проект' }).click();
  await expect(dialog.getByRole('status')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(close).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(close).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
  await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden');
});

test('short mobile menu scrolls to its last action and closes accessibly', async ({ page }) => {
  await page.setViewportSize({ width: 844, height: 390 });
  await page.goto('/');
  const burger = page.getByRole('button', { name: 'Меню', exact: true });
  await burger.click();
  const menu = page.locator('#header-menu');
  await expect(menu.getByRole('link', { name: 'Услуги', exact: true })).toBeFocused();
  await burger.click();
  await expect(burger).toHaveAttribute('aria-expanded', 'false');
  await burger.click();
  await expect(menu.getByRole('link', { name: 'Услуги', exact: true })).toBeFocused();
  const metrics = await menu.evaluate((element) => ({
    bottom: element.getBoundingClientRect().bottom,
    viewport: window.innerHeight,
    scrollable: element.scrollHeight > element.clientHeight,
  }));
  expect(metrics.bottom).toBeLessThanOrEqual(metrics.viewport + 1);
  expect(metrics.scrollable).toBe(true);
  const calculator = menu.getByRole('link', { name: /Рассчитать/i });
  await calculator.scrollIntoViewIfNeeded();
  await expect(calculator).toBeInViewport();
  await page.keyboard.press('Escape');
  await expect(burger).toBeFocused();
  await expect(burger).toHaveAttribute('aria-expanded', 'false');
  await burger.click();
  await calculator.click();
  await expect(page).toHaveURL(/\/#calculator$/);
  await expect(page.locator('#calculator')).toBeInViewport();
  await expect(burger).toHaveAttribute('aria-expanded', 'false');
});

test('language menu supports arrow navigation, Escape and keyboard selection', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const trigger = page.getByRole('button', { name: 'Язык сайта' });
  await trigger.focus();
  await page.keyboard.press('ArrowDown');
  const menu = page.getByRole('menu', { name: 'Язык сайта' });
  const options = menu.getByRole('menuitem');
  await expect(options.first()).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(options.last()).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(menu).toBeHidden();
  await expect(trigger).toBeFocused();
  await page.keyboard.press('ArrowUp');
  await expect(options.last()).toBeFocused();
  const english = page.getByRole('menuitem', { name: 'EN', exact: true });
  await english.focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/en$/);
});
