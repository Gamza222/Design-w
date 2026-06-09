import { useTranslation } from 'react-i18next';

import { getPosts } from '@entities/post';
import { getProjects } from '@entities/project';
import { ROUTES } from '@shared/config';
import { buildMeta, localeDict, useLocale, type RouteMetaArgs } from '@shared/lib';
import { Button, Container, Section } from '@shared/ui';
import { BlogList } from '@widgets/blog-list';
import { Hero } from '@widgets/hero';
import { Packages } from '@widgets/packages';
import { PortfolioGrid } from '@widgets/portfolio-grid';
import { ServicesList } from '@widgets/services-list';

export function meta({ location }: RouteMetaArgs) {
  const t = localeDict(location.pathname);
  return buildMeta(`${t.brand} — ${t.home.hero.eyebrow}`, t.home.hero.subtitle, location.pathname);
}

export default function HomePage() {
  const { t } = useTranslation();
  const locale = useLocale();
  const projects = getProjects(locale).slice(0, 3);
  const posts = getPosts(locale).slice(0, 3);

  return (
    <>
      <Hero />
      <Packages />
      <Section>
        <ServicesList title={t('home.services.title')} />
      </Section>

      {projects.length > 0 && (
        <Section>
          <PortfolioGrid projects={projects} title={t('home.portfolio.title')} />
        </Section>
      )}

      {posts.length > 0 && (
        <Section>
          <BlogList posts={posts} title={t('home.blog.title')} />
        </Section>
      )}

      <Section>
        <Container>
          <Button to={ROUTES.contact}>{t('cta.discuss')}</Button>
        </Container>
      </Section>
    </>
  );
}
