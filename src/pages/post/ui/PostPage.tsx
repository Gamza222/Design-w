import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';

import { getPost } from '@entities/post';

import { ContactCta } from '@widgets/contact-cta';
import { getLocaleFromPath, ROUTES } from '@shared/config';
import { buildMeta, formatDate, localeDict, useLocale, type RouteMetaArgs } from '@shared/lib';
import { AppLink, Button, Container, Image, Prose, Section } from '@shared/ui';

import styles from './PostPage.module.scss';

export function meta({ location, params }: RouteMetaArgs) {
  const t = localeDict(location.pathname);
  const post = getPost(getLocaleFromPath(location.pathname), params.slug ?? '');
  const title = post ? `${post.frontmatter.title} | ${t.brand}` : t.notFound.title;
  return buildMeta(title, post?.frontmatter.description ?? '', location.pathname, {
    image: post?.frontmatter.cover,
    imageAlt: post?.frontmatter.title,
    type: 'article',
  });
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
          <article>
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
                sizes="100vw"
                priority
              />
            )}

            <Prose>
              <Component />
            </Prose>
            {frontmatter.externalUrl ? (
              <Button href={frontmatter.externalUrl} target="_blank" rel="noopener noreferrer">
                {t('blog.readOriginal')}
              </Button>
            ) : null}
          </article>
        </Container>
      </Section>

      {/* Страница не обрывается в футер — CTA-мост к заявке. */}
      <ContactCta />
    </>
  );
}
