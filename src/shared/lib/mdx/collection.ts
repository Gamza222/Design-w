import { isLocale } from '../../config/locales';
import type { CollectionItem, MdxModule } from './types';

// Matches /content/<type>/<locale>/<slug>.mdx
const PATH_RE = /\/content\/[^/]+\/([^/]+)\/([^/]+)\.mdx$/;

/**
 * Turn the result of `import.meta.glob('/content/<type>/**\/*.mdx', { eager: true })`
 * into a typed, draft-filtered list of entries. The literal glob call must live in
 * the entity (the pattern has to be static); this helper just shapes the modules.
 */
export function buildCollection<TFrontmatter extends { draft?: boolean }>(
  modules: Record<string, MdxModule<TFrontmatter>>,
): CollectionItem<TFrontmatter>[] {
  const items: CollectionItem<TFrontmatter>[] = [];

  for (const [path, mod] of Object.entries(modules)) {
    const match = PATH_RE.exec(path);
    if (!match) continue;

    const [, locale, slug] = match;
    if (!isLocale(locale)) continue;
    if (mod.frontmatter?.draft) continue;

    items.push({
      slug,
      locale,
      frontmatter: mod.frontmatter,
      Component: mod.default,
    });
  }

  return items;
}
