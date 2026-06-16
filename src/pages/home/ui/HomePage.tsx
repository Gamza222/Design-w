import { useTranslation } from 'react-i18next';

import { getPosts } from '@entities/post';
import { getProjects } from '@entities/project';
import { ROUTES } from '@shared/config';
import { buildMeta, localeDict, useLocale, type RouteMetaArgs } from '@shared/lib';
import { Button, Container, Section, SectionHeader } from '@shared/ui';
import { Achievements } from '@widgets/achievements';
import { BlogList } from '@widgets/blog-list';
import { Fears } from '@widgets/fears';
import { Hero } from '@widgets/hero';
import { Packages } from '@widgets/packages';
import { Process } from '@widgets/process';
import { Projects } from '@widgets/projects';

import styles from './HomePage.module.scss';

export function meta({ location }: RouteMetaArgs) {
  const t = localeDict(location.pathname);
  return buildMeta(`${t.brand} — ${t.home.hero.eyebrow}`, t.home.hero.subtitle, location.pathname);
}

export default function HomePage() {
  const { t } = useTranslation();
  const locale = useLocale();
  const projects = getProjects(locale).slice(0, 6);
  const posts = getPosts(locale).slice(0, 3);

  // Поток главной по макету 01: первый экран = Hero с рядом пакетов на фото, далее плотно
  // Процесс → Проекты(тёмные) → Достижения → Страхи → Блог → финальный CTA.
  return (
    <>
      <Hero bottomSlot={<Packages />} />
      <Process />
      <Projects projects={projects} />
      <Achievements />
      <Fears />

      {posts.length > 0 && (
        <Section compact>
          <BlogList posts={posts} title={t('home.blog.title')} />
        </Section>
      )}

      <Section compact tone="dark">
        <Container className={styles.cta}>
          <SectionHeader
            eyebrow={t('home.contactCta.eyebrow')}
            title={t('home.contactCta.title')}
            subtitle={t('home.contactCta.subtitle')}
            align="center"
          />
          <Button to={ROUTES.contact} size="lg">
            {t('cta.discuss')}
          </Button>
        </Container>
      </Section>
    </>
  );
}
