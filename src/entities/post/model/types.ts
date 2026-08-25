import type { CollectionItem } from '@shared/lib';

export interface PostMeta {
  title: string;
  description: string;
  /** ISO date string, e.g. "2026-05-20". */
  date: string;
  cover?: string;
  tags?: string[];
  author?: string;
  draft?: boolean;
}

export type Post = CollectionItem<PostMeta>;
