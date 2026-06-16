import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

import type { Project } from '@entities/project';
import { ROUTES } from '@shared/config';
import { cn } from '@shared/lib';
import { AppLink, Container, IconArrowRight, IconChevronDown } from '@shared/ui';

import { ProjectTile } from '../ProjectTile/ProjectTile';
import styles from './Projects.module.scss';

interface ProjectsProps {
  projects: Project[];
}

/** Секция «Примеры наших работ» (tone=light, макет главной 01) — заголовок и ссылка слева, сетка
 *  кейсов справа во всю ширину. Показывается столько карточек, сколько влезает в ряд; остальные
 *  раскрывает кнопка «Ещё» (без горизонтального слайдера). Данные — из entity `project`. */
export function Projects({ projects }: ProjectsProps) {
  const { t } = useTranslation();
  const root = useRef<HTMLElement>(null);
  const [expanded, setExpanded] = useState(false);

  // Появление плиток по скроллу. Уважаем prefers-reduced-motion.
  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      gsap.from(`.${styles.gallery} > *`, {
        y: 24,
        autoAlpha: 0,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: { trigger: `.${styles.gallery}`, start: 'top 88%', once: true },
      });
    },
    { scope: root },
  );

  if (projects.length === 0) return null;

  return (
    <section className={styles.projects} ref={root} data-tone="light">
      <Container className={styles.inner}>
        <div className={styles.head}>
          <h2 className={styles.title}>{t('home.portfolio.title')}</h2>
          <AppLink to={ROUTES.portfolio} className={styles.headCta}>
            <span>{t('home.portfolio.cta')}</span>
            <IconArrowRight aria-hidden="true" />
          </AppLink>
        </div>

        <div className={styles.galleryCol}>
          <div className={cn(styles.gallery, expanded && styles.expanded)}>
            {projects.map((project) => (
              <ProjectTile key={`${project.locale}-${project.slug}`} project={project} />
            ))}
          </div>

          {!expanded && (
            <button type="button" className={styles.moreBtn} onClick={() => setExpanded(true)}>
              <span>{t('home.portfolio.more')}</span>
              <IconChevronDown className={styles.moreIcon} aria-hidden="true" />
            </button>
          )}
        </div>
      </Container>
    </section>
  );
}
