import { expect, test, type Page } from '@playwright/test';

async function openHome(page: Page) {
  await page.goto('/');
  // The prerendered page is visible before hydration. Wait until the application
  // has removed its startup curtain before driving scroll and keyboard events.
  await expect(page.locator('body > div[aria-hidden="true"]')).toHaveCount(0);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
}

test.describe('motion and accessible content', () => {
  test.use({ contextOptions: { reducedMotion: 'no-preference' } });

  for (const width of [390, 1440]) {
    test(`reveals leave every home section readable at ${width}px`, async ({ page }) => {
      test.setTimeout(60_000);
      await page.setViewportSize({ width, height: 844 });
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      await openHome(page);

      const headings = page.locator('main h2');
      for (let index = 0; index < (await headings.count()); index += 1) {
        const heading = headings.nth(index);
        await heading.evaluate((element) =>
          element.scrollIntoView({ behavior: 'instant', block: 'center' }),
        );
        await expect
          .poll(() =>
            heading.evaluate((element) => {
              let current: Element | null = element;
              const hidden = [];
              while (current) {
                const style = getComputedStyle(current);
                if (style.visibility === 'hidden' || Number(style.opacity) < 0.99) {
                  hidden.push({
                    heading: element.textContent,
                    ancestor: current.className,
                    opacity: style.opacity,
                    visibility: style.visibility,
                    top: current.getBoundingClientRect().top,
                    scrollY: window.scrollY,
                  });
                }
                current = current.parentElement;
              }
              return hidden;
            }),
          )
          .toEqual([]);
      }

      expect(errors).toEqual([]);
      expect(
        await page.evaluate(() =>
          Math.max(0, document.documentElement.scrollWidth - window.innerWidth),
        ),
      ).toBeLessThanOrEqual(1);
    });
  }

  test('enabling reduced motion restores content waiting for a reveal', async ({ page }) => {
    await openHome(page);
    const hiddenReveals = page.locator('main [style*="visibility: hidden"]');
    await expect.poll(() => hiddenReveals.count()).toBeGreaterThan(0);

    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(hiddenReveals).toHaveCount(0);
    expect(
      await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior),
    ).toBe('auto');
  });

  test('FAQ keyboard toggles expose only the current answer', async ({ page }) => {
    await openHome(page);
    const secondQuestion = page.locator('#faq-1-btn');
    await secondQuestion.evaluate((element) =>
      element.scrollIntoView({ behavior: 'instant', block: 'center' }),
    );
    await expect(secondQuestion).toBeVisible();
    await expect(page.locator('#faq-1-region')).toBeHidden();

    await secondQuestion.focus();
    await page.keyboard.press('Enter');
    await expect(secondQuestion).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('#faq-1-region')).toBeVisible();
    await expect(page.locator('#faq-0-region')).toBeHidden();

    await page.keyboard.press('Space');
    await expect(page.locator('#faq-1-region')).toBeHidden();
    await expect(secondQuestion).toBeFocused();
  });
});
