import { useTranslation } from 'react-i18next';

import type { Project } from '@entities/project';
import { ROUTES } from '@shared/config';
import { AppLink } from '@shared/ui';

import styles from './ProjectTile.module.scss';

interface ProjectTileProps {
  project: Project;
}

/** Компактная плитка кейса (макет 01/05): фото на всю карточку с бейджем площади сверху и
 *  подписью (название / стиль · город) светлым поверх фото на тёмном скриме снизу. */
export function ProjectTile({ project }: ProjectTileProps) {
  const { t } = useTranslation();
  const { slug, frontmatter } = project;

  return (
    <AppLink to={ROUTES.project(slug)} className={styles.tile}>
      <div className={styles.media}>
        {frontmatter.cover && (
          <img
            src={frontmatter.cover}
            alt={frontmatter.title}
            loading="lazy"
            className={styles.cover}
          />
        )}
        <span className={styles.area}>
          {frontmatter.area} {t('home.portfolio.areaUnit')}
        </span>
        <div className={styles.caption}>
          <h3 className={styles.title}>{frontmatter.title}</h3>
          <p className={styles.meta}>
            {frontmatter.style} · {frontmatter.location}
          </p>
        </div>
      </div>
    </AppLink>
  );
}
