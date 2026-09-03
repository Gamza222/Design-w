import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';

import { getPost } from '@entities/post';

import { ContactCta } from '@widgets/contact-cta';
import { getLocaleFromPath, ROUTES } from '@shared/config';
import { buildMeta, formatDate, localeDict, useLocale, type RouteMetaArgs } from '@shared/lib';
import { AppLink, Container, Image, Prose, Section } from '@shared/ui';

import styles from './PostPage.module.scss';

export function meta({ location, params }: RouteMetaArgs) {
  const t = localeDict(location.pathname);
  const post = getPost(getLocaleFromPath(location.pathname), params.slug ?? '');
  const title = post ? `${post.frontmatter.title} | ${t.brand}` : t.notFound.title;
  return buildMeta(title, post?.frontmatter.description ?? '', location.pathname);
}

export default function PostPage() {
  const { t } = useTranslation();
  const locale = useLocale();
  const { slug } = useParams();
  const post = slug ? getPost(locale, slug) : undefined;

  if (!post) {
    throw new Response('Not Found', { status: 404 });
  }

  const { frontmatter, Component } = post;

  return (
    <>
      <Section>
        <Container>
          <AppLink to={ROUTES.blog} className={styles.back}>
            ← {t('blog.title')}
          </AppLink>

          <header className={styles.head}>
            <time dateTime={frontmatter.date} className={styles.date}>
              {formatDate(frontmatter.date, locale)}
            </time>
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

          <Prose>
            <Component />
          </Prose>
        </Container>
      </Section>

      {/* Страница не обрывается в футер — CTA-мост к заявке. */}
      <ContactCta />
    </>
  );
}
