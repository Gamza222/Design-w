import { type CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';

import { PostCard, type Post } from '@entities/post';
import { DZEN_CHANNEL_URL, HOME_SECTIONS } from '@shared/config';
import { useScrollReveal } from '@shared/lib';
import { Button, Container, IconArrowRight, SectionHeader } from '@shared/ui';

import styles from './BlogHome.module.scss';

interface BlogHomeProps {
  posts: Post[];
}

/** Секция «Блог» на главной (tone=light, макет 08) — слева шапка + кнопка «Смотреть все статьи»,
 *  справа лента из 3 карточек статей (бейдж категории, дата, заголовок, лид). Данные — entity post. */
export function BlogHome({ posts }: BlogHomeProps) {
  const { t } = useTranslation();

  // Появление шапки, кнопки и карточек по скроллу (общий хук).
  const root = useScrollReveal<HTMLElement>(
    [`.${styles.header}`, `.${styles.cta}`, `.${styles.cards} > *`],
    { start: 'top 80%', stagger: 0.1 },
  );

  if (posts.length === 0) return null;

  return (
    <section id={HOME_SECTIONS.blog} className={styles.blog} ref={root} data-tone="light">
      <Container className={styles.inner}>
        <div className={styles.head}>
          <SectionHeader
            eyebrow={t('home.blog.eyebrow')}
            title={t('home.blog.title')}
            subtitle={t('home.blog.subtitle')}
            className={styles.header}
          />
          <Button
            href={DZEN_CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            variant="ghost"
            className={styles.cta}
          >
            <span>{t('home.blog.cta')}</span>
            <IconArrowRight aria-hidden="true" />
          </Button>
        </div>

        <div
          className={styles.cards}
          style={{ '--blog-cols': Math.min(posts.length, 3) } as CSSProperties}
        >
          {posts.map((post) => (
            <PostCard key={`${post.locale}-${post.slug}`} post={post} />
          ))}
        </div>
      </Container>
    </section>
  );
}
