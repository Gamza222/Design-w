import type { ComponentType } from 'react';

import type { Locale } from '../../config/locales';

export type MdxComponent = ComponentType;

/** Shape of an `.mdx` module produced by @mdx-js/rollup + remark-mdx-frontmatter. */
export interface MdxModule<TFrontmatter> {
  default: MdxComponent;
  frontmatter: TFrontmatter;
}

/** One resolved content entry within a collection (blog, portfolio, …). */
export interface CollectionItem<TFrontmatter> {
  slug: string;
  locale: Locale;
  frontmatter: TFrontmatter;
  Component: MdxComponent;
}
