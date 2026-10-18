import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';

import { getProject } from '@entities/project';
import { getLocaleFromPath, ROUTES } from '@shared/config';
import { buildMeta, localeDict, openLeadDialog, useLocale, type RouteMetaArgs } from '@shared/lib';
import { Accordion, AppLink, Button, Container, Image, Prose, Section } from '@shared/ui';

import styles from './ProjectPage.module.scss';

export function meta({ location, params }: RouteMetaArgs) {
  const t = localeDict(location.pathname);
  const project = getProject(getLocaleFromPath(location.pathname), params.slug ?? '');
  const title = project ? `${project.frontmatter.title} | ${t.brand}` : t.notFound.title;
  return buildMeta(title, project?.frontmatter.description ?? '', location.pathname, {
    image: project?.frontmatter.cover,
    imageAlt: project?.frontmatter.coverAlt,
    type: 'article',
  });
}

export default function ProjectPage() {
  const { t } = useTranslation();
  const locale = useLocale();
  const { slug } = useParams();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const project = slug ? getProject(locale, slug) : undefined;

  if (!project) throw new Response('Not Found', { status: 404 });

  const { frontmatter, Component } = project;
  const facts = [
    { label: t('portfolio.meta.style'), value: frontmatter.style },
    { label: t('portfolio.meta.year'), value: frontmatter.year },
    { label: t('portfolio.meta.location'), value: frontmatter.location },
    {
      label: t('portfolio.meta.area'),
      value: frontmatter.area ? `${frontmatter.area} ${t('portfolio.meta.areaUnit')}` : undefined,
    },
  ].filter((fact) => fact.value);
  const seen = new Set(frontmatter.cover ? [frontmatter.cover] : []);
  const gallery = (frontmatter.gallery ?? []).filter((item) => {
    if (seen.has(item.src)) return false;
    seen.add(item.src);
    return true;
  });

  return (
    <Section>
      <Container>
        <article className={styles.article}>
          <AppLink to={ROUTES.portfolio} className={styles.back}>
            ← {t('portfolio.title')}
          </AppLink>
          <header className={styles.head}>
            <h1>{frontmatter.title}</h1>
            <p className={styles.lead}>{frontmatter.description}</p>
          </header>

          {frontmatter.cover ? (
            <figure className={styles.coverFigure}>
              <Image
                src={frontmatter.cover}
                alt={frontmatter.coverAlt ?? frontmatter.title}
                width={frontmatter.coverWidth}
                height={frontmatter.coverHeight}
                className={styles.cover}
                sizes="100vw"
                priority
              />
              <figcaption>{frontmatter.coverAlt}</figcaption>
            </figure>
          ) : null}

          <dl className={styles.facts}>
            {facts.map((fact) => (
              <div key={fact.label}>
                <dt className={styles.factLabel}>{fact.label}</dt>
                <dd className={styles.factValue}>{fact.value}</dd>
              </div>
            ))}
          </dl>

          {frontmatter.task || frontmatter.solution ? (
            <div className={styles.confirmed}>
              {frontmatter.task ? (
                <section>
                  <h2>{t('portfolio.project.task')}</h2>
                  <p>{frontmatter.task}</p>
                </section>
              ) : null}
              {frontmatter.solution ? (
                <section>
                  <h2>{t('portfolio.project.solution')}</h2>
                  <p>{frontmatter.solution}</p>
                </section>
              ) : null}
            </div>
          ) : null}

          <Prose>
            <Component />
          </Prose>

          {gallery.length > 0 ? (
            <section className={styles.gallerySection} aria-labelledby="project-gallery">
              <h2 id="project-gallery">{t('portfolio.project.gallery')}</h2>
              <div className={styles.gallery}>
                {gallery.map((item) => (
                  <figure key={item.src}>
                    <Image
                      src={item.src}
                      alt={item.alt}
                      width={item.width}
                      height={item.height}
                      className={styles.galleryImage}
                      sizes="100vw"
                    />
                    <figcaption>{item.caption ?? item.alt}</figcaption>
                  </figure>
                ))}
              </div>
            </section>
          ) : null}

          <section className={styles.nextStep} aria-labelledby="project-next-step">
            <div>
              <h2 id="project-next-step">{t('portfolio.project.ctaTitle')}</h2>
              <p>{t('portfolio.project.ctaText')}</p>
            </div>
            <Button
              onClick={() => openLeadDialog({ source: 'project-page', project: project.slug })}
            >
              {t('portfolio.project.cta')}
            </Button>
          </section>

          {frontmatter.faq?.length ? (
            <section className={styles.faq} aria-labelledby="project-faq">
              <h2 id="project-faq">{t('portfolio.project.faqTitle')}</h2>
              {frontmatter.faq.map((item, index) => (
                <Accordion
                  key={item.question}
                  id={`project-faq-${index}`}
                  summary={item.question}
                  open={openFaq === index}
                  onToggle={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <p>{item.answer}</p>
                </Accordion>
              ))}
            </section>
          ) : null}
        </article>
      </Container>
    </Section>
  );
}
