import { ROUTES } from '@shared/config';
import { formatDate, useLocale } from '@shared/lib';
import { AppLink, IconArrowRight, Image } from '@shared/ui';

import type { Post } from '../../model/types';
import styles from './PostCard.module.scss';

interface PostCardProps {
  post: Post;
}

/** Заглавная буква первого тега → бейдж-категория («свет» → «Свет»). */
function category(tags?: string[]): string | undefined {
  const first = tags?.[0]?.trim();
  return first ? first.charAt(0).toUpperCase() + first.slice(1) : undefined;
}

export function PostCard({ post }: PostCardProps) {
  const locale = useLocale();
  const { slug, frontmatter } = post;
  const tag = category(frontmatter.tags);
  const content = (
    <>
      {frontmatter.cover && (
        <div className={styles.media}>
          <Image
            src={frontmatter.cover}
            alt={frontmatter.title}
            ratio="3 / 2"
            className={styles.cover}
          />
          {tag && <span className={styles.tag}>{tag}</span>}
        </div>
      )}
      <div className={styles.body}>
        <time className={styles.date} dateTime={frontmatter.date}>
          {formatDate(frontmatter.date, locale)}
        </time>
        <h3 className={styles.title}>{frontmatter.title}</h3>
        <p className={styles.excerpt}>{frontmatter.description}</p>
        <span className={styles.more} aria-hidden="true">
          <IconArrowRight />
        </span>
      </div>
    </>
  );

  if (frontmatter.externalUrl) {
    return (
      <a
        href={frontmatter.externalUrl}
        className={styles.card}
        target="_blank"
        rel="noopener noreferrer"
      >
        {content}
      </a>
    );
  }

  return (
    <AppLink to={ROUTES.post(slug)} className={styles.card}>
      {content}
    </AppLink>
  );
}
