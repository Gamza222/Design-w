import { useTranslation } from 'react-i18next';

import { ROUTES } from '@shared/config';
import { useScrollReveal } from '@shared/lib';
import { AppLink, Container, IconArrowRight, IconQuote, Rating, SectionHeader } from '@shared/ui';

import { bigReviewImage } from '../../config/images';
import styles from './Reviews.module.scss';

interface Review {
  name: string;
  city: string;
  rating: number;
  text: string;
}

/** Инициалы автора для аватарки («Ольга и Михаил» → «ОМ»). */
function initials(name: string): string {
  const words = name
    .trim()
    .split(/[\s&]+/)
    .filter(Boolean);
  const significant = words.filter((w) => w.length > 1);
  const pick = (significant.length ? significant : words).slice(0, 2);
  return pick.map((w) => w[0]?.toUpperCase() ?? '').join('') || '—';
}

/** Секция «Что говорят наши клиенты» (tone=dark, макет 10) — шапка слева + блок рейтинга 4.9★
 *  справа; ниже один большой отзыв с фото проекта + два коротких стопкой. Контент — i18n. */
export function Reviews() {
  const { t } = useTranslation();
  const items = t('home.reviews.items', { returnObjects: true }) as Review[];
  const [big, ...shorts] = items;

  // Появление шапки, блока рейтинга и отзывов по скроллу (общий хук).
  const root = useScrollReveal<HTMLElement>(
    [`.${styles.headText}`, `.${styles.ratingBlock}`, `.${styles.big}`, `.${styles.short}`],
    { start: 'top 80%', stagger: 0.1 },
  );

  if (!big) return null;

  return (
    <section className={styles.reviews} ref={root} data-tone="dark">
      <Container className={styles.inner}>
        <div className={styles.head}>
          <SectionHeader
            eyebrow={t('home.reviews.eyebrow')}
            title={t('home.reviews.title')}
            subtitle={t('home.reviews.subtitle')}
            className={styles.headText}
          />
          <div className={styles.ratingBlock}>
            <span className={styles.ratingValue}>{t('home.reviews.ratingValue')}</span>
            <div className={styles.ratingMeta}>
              <Rating value={Number(t('home.reviews.ratingValue'))} className={styles.ratingStars} />
              <span className={styles.ratingLabel}>{t('home.reviews.ratingLabel')}</span>
            </div>
            <AppLink to={ROUTES.about} className={styles.ratingCta}>
              <span>{t('home.reviews.ratingCta')}</span>
              <IconArrowRight aria-hidden="true" />
            </AppLink>
          </div>
        </div>

        <div className={styles.grid}>
          {/* Большой отзыв */}
          <article className={styles.big}>
            <div className={styles.bigBody}>
              <IconQuote className={styles.quote} aria-hidden="true" />
              <p className={styles.bigText}>{big.text}</p>
              <footer className={styles.foot}>
                <span className={styles.avatar} aria-hidden="true">
                  {initials(big.name)}
                </span>
                <div className={styles.who}>
                  <p className={styles.name}>{big.name}</p>
                  <p className={styles.city}>{big.city}</p>
                </div>
                <Rating value={big.rating} className={styles.footRating} />
              </footer>
            </div>
            <div
              className={styles.bigPhoto}
              style={{ backgroundImage: `url(${bigReviewImage})` }}
              aria-hidden="true"
            />
          </article>

          {/* Короткие отзывы */}
          <div className={styles.shorts}>
            {shorts.map((review) => (
              <article key={review.name} className={styles.short}>
                <Rating value={review.rating} className={styles.shortRating} />
                <p className={styles.shortText}>{review.text}</p>
                <footer className={styles.foot}>
                  <span className={styles.avatar} aria-hidden="true">
                    {initials(review.name)}
                  </span>
                  <div className={styles.who}>
                    <p className={styles.name}>{review.name}</p>
                    <p className={styles.city}>{review.city}</p>
                  </div>
                </footer>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
