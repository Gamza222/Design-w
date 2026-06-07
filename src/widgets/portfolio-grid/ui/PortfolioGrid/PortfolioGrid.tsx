import { ProjectCard, type Project } from '@entities/project';
import { Container } from '@shared/ui';

import styles from './PortfolioGrid.module.scss';

interface PortfolioGridProps {
  projects: Project[];
  title?: string;
}

export function PortfolioGrid({ projects, title }: PortfolioGridProps) {
  return (
    <Container>
      {title && <h2 className={styles.title}>{title}</h2>}
      <div className={styles.grid}>
        {projects.map((project) => (
          <ProjectCard key={`${project.locale}-${project.slug}`} project={project} />
        ))}
      </div>
    </Container>
  );
}
