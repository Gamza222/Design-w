import { defineConfig, devices } from '@playwright/test';

const PORT = 3000;
// Стучимся по IPv4-петле: vite preview по умолчанию слушает только IPv6 (`[::1]`),
// а к IPv6-loopback на части окружений (Windows / часть CI) connect не проходит —
// webServer-проба Playwright виснет до таймаута. Поэтому сервер ниже поднимаем на
// `--host 127.0.0.1`, а адрес фиксируем как 127.0.0.1 (а не `localhost`).
const HOST = '127.0.0.1';
const BASE_URL = `http://${HOST}:${PORT}`;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'html',
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    // Входные GSAP-анимации (хедер/Hero/пакеты) уважают prefers-reduced-motion и
    // отрисовывают контент сразу — так e2e не гоняется с анимацией появления.
    contextOptions: { reducedMotion: 'reduce' },
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: `npm run build && npm run preview -- --host ${HOST}`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
