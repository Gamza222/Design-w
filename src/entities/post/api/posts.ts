import { buildCollection, type MdxModule } from '@shared/lib';
import type { Locale } from '@shared/config';

import type { Post, PostMeta } from '../model/types';

// Static glob — resolved at build time into the bundle. Each module exposes a
// `default` component and a `frontmatter` export (remark-mdx-frontmatter).
const modules = import.meta.glob('/content/blog/**/*.mdx', { eager: true }) as Record<
  string,
  MdxModule<PostMeta>
>;

const posts = buildCollection<PostMeta>(modules);

/** Published posts for a locale, newest first. */
export function getPosts(locale: Locale): Post[] {
  return posts
    .filter((post) => post.locale === locale)
    .sort((a, b) => (a.frontmatter.date < b.frontmatter.date ? 1 : -1));
}

/** A single post by slug within a locale. */
export function getPost(locale: Locale, slug: string): Post | undefined {
  return posts.find((post) => post.locale === locale && post.slug === slug);
}
