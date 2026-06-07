import { ROUTES } from '@shared/config';
import { formatDate, useLocale } from '@shared/lib';
import { AppLink, Image } from '@shared/ui';

import type { Post } from '../../model/types';
import styles from './PostCard.module.scss';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const locale = useLocale();
  const { slug, frontmatter } = post;

  return (
    <AppLink to={ROUTES.post(slug)} className={styles.card}>
      {frontmatter.cover && (
        <Image
          src={frontmatter.cover}
          alt={frontmatter.title}
          ratio="3 / 2"
          className={styles.cover}
        />
      )}
      <div className={styles.body}>
        <time className={styles.date} dateTime={frontmatter.date}>
          {formatDate(frontmatter.date, locale)}
        </time>
        <h3 className={styles.title}>{frontmatter.title}</h3>
        <p className={styles.excerpt}>{frontmatter.description}</p>
      </div>
    </AppLink>
  );
}
