import { ROUTES } from '@shared/config';
import { AppLink, Image } from '@shared/ui';

import type { Project } from '../../model/types';
import styles from './ProjectCard.module.scss';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const { slug, frontmatter } = project;

  return (
    <AppLink to={ROUTES.project(slug)} className={styles.card}>
      {frontmatter.cover && (
        <div className={styles.media}>
          <Image
            src={frontmatter.cover}
            alt={frontmatter.title}
            ratio="4 / 5"
            className={styles.cover}
          />
        </div>
      )}
      <div className={styles.body}>
        <h3 className={styles.title}>{frontmatter.title}</h3>
        <p className={styles.meta}>
          {frontmatter.style} · {frontmatter.area} m² · {frontmatter.year}
        </p>
      </div>
    </AppLink>
  );
}
