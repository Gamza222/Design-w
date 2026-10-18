import { type CSSProperties } from 'react';

import { PostCard, type Post } from '@entities/post';
import { useScrollReveal } from '@shared/lib';
import { Container } from '@shared/ui';

import styles from './BlogList.module.scss';

interface BlogListProps {
  posts: Post[];
  title?: string;
}

export function BlogList({ posts, title }: BlogListProps) {
  // Появление заголовка и карточек по скроллу (общий хук).
  const root = useScrollReveal<HTMLDivElement>([`.${styles.title}`, `.${styles.grid} > *`]);

  return (
    <Container ref={root}>
      {title && <h2 className={styles.title}>{title}</h2>}
      <div
        className={styles.grid}
        // Пока постов меньше трёх, сетка сужается под их число — ряд заполняет контейнер
        // более широкими карточками вместо пустой колонки справа.
        style={{ '--blog-cols': Math.min(posts.length, 3) } as CSSProperties}
      >
        {posts.map((post) => (
          <PostCard key={`${post.locale}-${post.slug}`} post={post} />
        ))}
      </div>
    </Container>
  );
}
