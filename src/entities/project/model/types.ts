import type { CollectionItem } from '@shared/lib';

export interface ProjectMeta {
  title: string;
  description: string;
  /** Only publish these facts once confirmed by the studio. */
  year?: number;
  location?: string;
  area?: number;
  task?: string;
  solution?: string;
  order?: number;
  style: string;
  cover?: string;
  coverAlt?: string;
  coverWidth?: number;
  coverHeight?: number;
  gallery?: ProjectImage[];
  faq?: { question: string; answer: string }[];
  services?: string[];
  draft?: boolean;
}

export interface ProjectImage {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
}

export type Project = CollectionItem<ProjectMeta>;
