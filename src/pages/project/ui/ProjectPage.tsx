import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';

import { getProject } from '@entities/project';

import { ContactCta } from '@widgets/contact-cta';
import { getLocaleFromPath, ROUTES } from '@shared/config';
import { buildMeta, localeDict, useLocale, type RouteMetaArgs } from '@shared/lib';
import { AppLink, Container, Image, Prose, Section } from '@shared/ui';

import styles from './ProjectPage.module.scss';

export function meta({ location, params }: RouteMetaArgs) {
  const t = localeDict(location.pathname);
  const project = getProject(getLocaleFromPath(location.pathname), params.slug ?? '');
  const title = project ? `${project.frontmatter.title} — ${t.brand}` : t.notFound.title;
  return buildMeta(title, project?.frontmatter.description ?? '', location.pathname);
}

export default function ProjectPage() {
  const { t } = useTranslation();
  const locale = useLocale();
  const { slug } = useParams();
  const project = slug ? getProject(locale, slug) : undefined;

  if (!project) {
    throw new Response('Not Found', { status: 404 });
  }

  const { frontmatter, Component } = project;
  const facts = [
    { label: t('portfolio.meta.year'), value: frontmatter.year },
    { label: t('portfolio.meta.location'), value: frontmatter.location },
    {
      label: t('portfolio.meta.area'),
      value: `${frontmatter.area} ${t('portfolio.meta.areaUnit')}`,
    },
    { label: t('portfolio.meta.style'), value: frontmatter.style },
  ];

  return (
    <>
      <Section>
        <Container>
          <AppLink to={ROUTES.portfolio} className={styles.back}>
            ← {t('portfolio.title')}
          </AppLink>

          <header className={styles.head}>
            <h1>{frontmatter.title}</h1>
            <p className={styles.lead}>{frontmatter.description}</p>
          </header>

          {frontmatter.cover && (
            <Image
              src={frontmatter.cover}
              alt={frontmatter.title}
              ratio="16 / 9"
              className={styles.cover}
              priority
            />
          )}

          <dl className={styles.facts}>
            {facts.map((fact) => (
              <div key={fact.label} className={styles.fact}>
                <dt className={styles.factLabel}>{fact.label}</dt>
                <dd className={styles.factValue}>{fact.value}</dd>
              </div>
            ))}
          </dl>

          <Prose>
            <Component />
          </Prose>

          {frontmatter.gallery && frontmatter.gallery.length > 0 && (
            <div className={styles.gallery}>
              {frontmatter.gallery.map((src, index) => (
                <Image
                  key={src}
                  src={src}
                  alt={`${frontmatter.title} — ${index + 1}`}
                  ratio="4 / 3"
                  className={styles.galleryImage}
                />
              ))}
            </div>
          )}
        </Container>
      </Section>

      {/* Страница не обрывается в футер — CTA-мост к заявке. */}
      <ContactCta />
    </>
  );
}
