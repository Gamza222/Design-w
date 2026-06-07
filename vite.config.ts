import { reactRouter } from '@react-router/dev/vite';
import mdx from '@mdx-js/rollup';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    // MDX must run before the React Router plugin so `.mdx` content is transformed.
    mdx({
      remarkPlugins: [remarkFrontmatter, [remarkMdxFrontmatter, { name: 'frontmatter' }]],
      providerImportSource: '@mdx-js/react',
    }),
    reactRouter(),
    tsconfigPaths(),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        // Lets SCSS modules do `@use 'app/styles/abstracts' as *;` from anywhere under src/.
        loadPaths: ['src'],
      },
    },
  },
});
