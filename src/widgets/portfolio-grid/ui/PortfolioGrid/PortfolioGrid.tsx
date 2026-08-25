import { ProjectCard, type Project } from '@entities/project';
import { useScrollReveal } from '@shared/lib';
import { Container } from '@shared/ui';

import styles from './PortfolioGrid.module.scss';

interface PortfolioGridProps {
  projects: Project[];
  title?: string;
}

export function PortfolioGrid({ projects, title }: PortfolioGridProps) {
  // Появление заголовка и карточек по скроллу (общий хук).
  const root = useScrollReveal<HTMLDivElement>([`.${styles.title}`, `.${styles.grid} > *`]);

  return (
    <Container ref={root}>
      {title && <h2 className={styles.title}>{title}</h2>}
      <div className={styles.grid}>
        {projects.map((project) => (
          <ProjectCard key={`${project.locale}-${project.slug}`} project={project} />
        ))}
      </div>
    </Container>
  );
}
