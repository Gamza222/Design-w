import type { CollectionItem } from '@shared/lib';

export interface ProjectMeta {
  title: string;
  description: string;
  year: number;
  location: string;
  /** Area in square metres. */
  area: number;
  style: string;
  cover?: string;
  gallery?: string[];
  services?: string[];
  draft?: boolean;
}

export type Project = CollectionItem<ProjectMeta>;
