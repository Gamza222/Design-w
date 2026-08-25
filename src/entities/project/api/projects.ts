import { buildCollection, type MdxModule } from '@shared/lib';
import type { Locale } from '@shared/config';

import type { Project, ProjectMeta } from '../model/types';

const modules = import.meta.glob('/content/portfolio/**/*.mdx', { eager: true }) as Record<
  string,
  MdxModule<ProjectMeta>
>;

const projects = buildCollection<ProjectMeta>(modules);

/** Published projects for a locale, newest year first. */
export function getProjects(locale: Locale): Project[] {
  return projects
    .filter((project) => project.locale === locale)
    .sort((a, b) => b.frontmatter.year - a.frontmatter.year);
}

/** A single project by slug within a locale. */
export function getProject(locale: Locale, slug: string): Project | undefined {
  return projects.find((project) => project.locale === locale && project.slug === slug);
}
