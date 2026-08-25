import type { Config } from '@react-router/dev/config';
import { getAllPrerenderPaths } from './src/shared/lib/mdx/prerender-paths';

export default {
  // FSD app layer == React Router framework "app" directory.
  appDirectory: 'src/app',
  // Fully static output (no server runtime). Deploys to Vercel as static.
  ssr: false,
  // With ssr:false dynamic params are NOT auto-expanded — every path must be literal.
  // We derive the full list (static pages × locales + content slugs) at build time.
  async prerender() {
    return getAllPrerenderPaths();
  },
} satisfies Config;
