import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

// Kept separate from vite.config.ts so the React Router plugin (which expects a
// full app/server build) does not run inside the test runner.
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  css: {
    preprocessorOptions: {
      scss: {
        // Как в vite.config.ts: SCSS-модули могут делать `@use 'app/styles/abstracts' as *;`.
        loadPaths: ['src'],
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/shared/lib/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    css: true,
  },
});
