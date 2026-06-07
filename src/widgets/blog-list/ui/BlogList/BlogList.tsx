import { PostCard, type Post } from '@entities/post';
import { Container } from '@shared/ui';

import styles from './BlogList.module.scss';

interface BlogListProps {
  posts: Post[];
  title?: string;
}

export function BlogList({ posts, title }: BlogListProps) {
  return (
    <Container>
      {title && <h2 className={styles.title}>{title}</h2>}
      <div className={styles.grid}>
        {posts.map((post) => (
          <PostCard key={`${post.locale}-${post.slug}`} post={post} />
        ))}
      </div>
    </Container>
  );
}
