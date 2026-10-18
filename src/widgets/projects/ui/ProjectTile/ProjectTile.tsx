import { useTranslation } from 'react-i18next';

import type { Project } from '@entities/project';
import { ROUTES } from '@shared/config';
import { AppLink, Image } from '@shared/ui';

import styles from './ProjectTile.module.scss';

interface ProjectTileProps {
  project: Project;
}

/** A visual preview; optional case facts are shown only when supplied. */
export function ProjectTile({ project }: ProjectTileProps) {
  const { t } = useTranslation();
  const { slug, frontmatter } = project;

  return (
    <AppLink to={ROUTES.project(slug)} className={styles.tile}>
      <div className={styles.media}>
        {frontmatter.cover && (
          <Image
            src={frontmatter.cover}
            alt={frontmatter.coverAlt ?? frontmatter.title}
            width={frontmatter.coverWidth}
            height={frontmatter.coverHeight}
            className={styles.cover}
          />
        )}
        {frontmatter.area ? (
          <span className={styles.area}>
            {frontmatter.area} {t('home.portfolio.areaUnit')}
          </span>
        ) : null}
        <div className={styles.caption}>
          <h3 className={styles.title}>{frontmatter.title}</h3>
          <p className={styles.meta}>
            {[frontmatter.style, frontmatter.location].filter(Boolean).join(' · ')}
          </p>
        </div>
      </div>
    </AppLink>
  );
}
