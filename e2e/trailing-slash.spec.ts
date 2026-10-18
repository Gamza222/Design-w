import { expect, test } from './fixtures';

// Apache serves prerendered directories with a trailing slash, while prerendering
// uses canonical paths without it. Both must select the same document on hydration.
const directoryRoutes = [
  ['/privacy/', 'Политика конфиденциальности'],
  ['/offer/', 'Договор публичной оферты'],
  ['/requisites/', 'Реквизиты исполнителя'],
  ['/consent/', 'Согласие на обработку персональных данных'],
  ['/planirovka-kvartiry/', 'Планировка квартиры'],
  ['/3d-vizualizaciya-interera/', '3D-визуализация интерьера'],
  ['/eskiznyj-dizajn-proekt/', 'Полный дизайн-проект'],
] as const;

for (const [path, heading] of directoryRoutes) {
  test(`directory URL ${path} preserves its document after hydration`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.locator('[aria-controls="header-menu"]')).toBeEnabled();
    await expect(page.getByRole('heading', { level: 1, name: heading, exact: true })).toBeVisible();
    await expect(page).toHaveTitle(new RegExp(heading));
    expect(errors).toEqual([]);
  });
}
