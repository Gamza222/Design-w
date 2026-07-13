import { type CSSProperties, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaTelegramPlane } from 'react-icons/fa';

import { ROUTES } from '@shared/config';
import { useScrollReveal } from '@shared/lib';
import { AppLink, Container, IconArrowRight, Rating } from '@shared/ui';

import { teamImage } from '../../config/images';
import { STAT_ICONS } from '../../lib/stats';
import styles from './Achievements.module.scss';

interface AchievementStat {
  value: string;
  label: string;
  rating?: number;
}

interface Review {
  text: string;
  author: string;
  role: string;
  rating: number;
}

interface Team {
  title: string;
  text: string;
  cta: string;
}

/** Инициалы автора для аватарки (до 2 значимых слов: «Анна и Дмитрий» → «АД»). */
function initials(name: string): string {
  const words = name.trim().split(/[\s&]+/).filter(Boolean);
  const significant = words.filter((w) => w.length > 1);
  const pick = (significant.length ? significant : words).slice(0, 2);
  return pick.map((w) => w[0]?.toUpperCase() ?? '').join('') || '—';
}

/** Секция «Достижения» (tone=light, макет 01) — одна полоса в 3 зоны: слева цифры, в центре карусель
 *  отзывов, справа тёмная карточка «Наша команда». Без крупного заголовка (как в макете).
 *  Контент — i18n `home.achievements`. */
export function Achievements() {
  const { t } = useTranslation();
  const stats = t('home.achievements.stats', { returnObjects: true }) as AchievementStat[];
  const reviews = t('home.achievements.reviews', { returnObjects: true }) as Review[];
  const team = t('home.achievements.team', { returnObjects: true }) as Team;

  const [idx, setIdx] = useState(0);
  const review = reviews[idx] ?? reviews[0];
  const go = (delta: number) => setIdx((i) => (i + delta + reviews.length) % reviews.length);

  // Появление по скроллу (общий хук).
  const root = useScrollReveal<HTMLElement>([
    `.${styles.stat}`,
    `.${styles.reviews}`,
    `.${styles.team}`,
  ]);

  return (
    <section className={styles.achievements} ref={root} data-tone="light">
      <Container className={styles.inner}>
        {/* Зона 1 — цифры */}
        <ul className={styles.stats}>
          {stats.map((stat, i) => {
            const Icon = STAT_ICONS[i] ?? STAT_ICONS[0];
            return (
              <li key={stat.value} className={styles.stat}>
                <Icon className={styles.statIcon} aria-hidden="true" />
                <span className={styles.value}>{stat.value}</span>
                <span className={styles.label}>{stat.label}</span>
              </li>
            );
          })}
        </ul>

        {/* Зона 2 — карусель отзывов */}
        <div className={styles.reviews}>
          <p className={styles.reviewsTitle}>{t('home.achievements.reviewsTitle')}</p>
          <blockquote className={styles.review}>
            <p className={styles.reviewText}>«{review.text}»</p>
            <footer className={styles.reviewFoot}>
              <span className={styles.avatar} aria-hidden="true">
                {initials(review.author)}
              </span>
              <div className={styles.reviewMeta}>
                {/* Иконка внутри span с nowrap-хвостом: при переносе имени она едет за последним
                    словом, а не повисает отдельно по центру двухстрочного имени. */}
                <p className={styles.author}>
                  {review.author}
                  <FaTelegramPlane className={styles.reviewSocial} aria-hidden="true" />
                </p>
                <p className={styles.role}>{review.role}</p>
              </div>
              <Rating value={review.rating} className={styles.reviewRating} />
            </footer>
          </blockquote>
          {reviews.length > 1 && (
            <div className={styles.reviewNav}>
              <button
                type="button"
                className={styles.navBtn}
                onClick={() => go(-1)}
                aria-label={t('home.achievements.prevReview')}
              >
                <IconArrowRight aria-hidden="true" style={{ transform: 'rotate(180deg)' }} />
              </button>
              <span className={styles.navCounter}>
                {idx + 1} / {reviews.length}
              </span>
              <button
                type="button"
                className={styles.navBtn}
                onClick={() => go(1)}
                aria-label={t('home.achievements.nextReview')}
              >
                <IconArrowRight aria-hidden="true" />
              </button>
            </div>
          )}
        </div>

        {/* Зона 3 — карточка команды */}
        <article className={styles.team}>
          <div className={styles.teamBody}>
            <h3 className={styles.teamTitle}>{team.title}</h3>
            <p className={styles.teamText}>{team.text}</p>
            <AppLink to={ROUTES.about} className={styles.teamCta}>
              <span>{team.cta}</span>
              <IconArrowRight aria-hidden="true" />
            </AppLink>
          </div>
          <div
            className={styles.teamPhoto}
            style={{ '--team-photo': `url(${teamImage})` } as CSSProperties}
            aria-hidden="true"
          />
        </article>
      </Container>
    </section>
  );
}
