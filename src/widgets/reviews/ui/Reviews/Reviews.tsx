import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useLocale } from '@shared/lib';
import { Button, Container, IconQuote, Rating, SectionHeader } from '@shared/ui';

import { getPublishedReviews } from '../../model/reviews';
import styles from './Reviews.module.scss';

const PAGE_SIZE = 12;

/** No public empty state, invented authors or aggregate rating. */
export function Reviews() {
  const { t } = useTranslation();
  const locale = useLocale();
  const [visible, setVisible] = useState(PAGE_SIZE);
  const reviews = getPublishedReviews(locale);

  if (reviews.length === 0) return null;

  return (
    <section className={styles.reviews} data-tone="dark">
      <Container>
        <SectionHeader
          eyebrow={t('home.reviews.eyebrow')}
          title={t('home.reviews.title')}
          subtitle={t('home.reviews.subtitle')}
          className={styles.head}
        />
        <div className={styles.grid}>
          {reviews.slice(0, visible).map((review) => (
            <article key={review.id} className={styles.review}>
              <IconQuote className={styles.quote} aria-hidden="true" />
              <blockquote>{review.text}</blockquote>
              <footer className={styles.foot}>
                <p className={styles.name}>{review.name}</p>
                {review.city ? <p>{review.city}</p> : null}
                {review.rating !== undefined ? <Rating value={review.rating} /> : null}
                <a href={review.sourceUrl} target="_blank" rel="noopener noreferrer">
                  {t('home.reviews.source')}
                </a>
              </footer>
            </article>
          ))}
        </div>
        {reviews.length > visible ? (
          <Button
            className={styles.more}
            variant="ghost"
            onClick={() => setVisible((value) => value + PAGE_SIZE)}
          >
            {t('home.reviews.more')}
          </Button>
        ) : null}
      </Container>
    </section>
  );
}
