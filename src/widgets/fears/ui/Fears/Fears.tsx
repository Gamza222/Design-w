import { useTranslation } from 'react-i18next';

import { ROUTES } from '@shared/config';
import { useScrollReveal } from '@shared/lib';
import { Button, Container, IconArrowRight, IconBadge, IconShield, SectionHeader } from '@shared/ui';

import { fearsImage } from '../../config/images';
import { FEAR_ICONS } from '../fear-icons';
import styles from './Fears.module.scss';

interface FearItem {
  fear: string;
  answer: string;
}

/** Секция «Страхи» (tone=light, макет 07) — на больших экранах фото выходит из левого края страницы
 *  (full-bleed, на всю высоту, края растворяются в фоне), посередине шапка + задача студии + CTA,
 *  справа список «опасение → ответ» с двутоновыми иконками и плашка-гарантия снизу. Контент — i18n. */
export function Fears() {
  const { t } = useTranslation();
  const items = t('home.fears.items', { returnObjects: true }) as FearItem[];

  // Появление по скроллу (общий хук).
  const root = useScrollReveal<HTMLElement>([
    `.${styles.introText}`,
    `.${styles.item}`,
    `.${styles.guarantee}`,
  ]);

  return (
    <section className={styles.fears} ref={root} data-tone="light">
      <Container className={styles.inner}>
        {/* Фото: на мобиле — блок сверху; на ≥lg — выходит из левого края, на всю высоту, с растворённым краем. */}
        <div
          className={styles.photo}
          style={{ backgroundImage: `url(${fearsImage})` }}
          aria-hidden="true"
        />

        {/* Текстовый блок: шапка + «Наша задача» + CTA */}
        <div className={styles.introText}>
          <SectionHeader
            eyebrow={t('home.fears.eyebrow')}
            title={t('home.fears.title')}
            subtitle={t('home.fears.subtitle')}
            className={styles.head}
          />
          <span className={styles.divider} aria-hidden="true" />
          <p className={styles.mission}>
            <strong className={styles.missionLead}>{t('home.fears.missionTitle')}</strong>
            {' — '}
            {t('home.fears.missionText')}
          </p>
          <div className={styles.cta}>
            <Button to={ROUTES.contact} size="lg" className={styles.ctaBtn}>
              <span>{t('home.fears.cta')}</span>
              <IconArrowRight aria-hidden="true" />
            </Button>
            <p className={styles.ctaNote}>
              <IconShield className={styles.ctaNoteIcon} aria-hidden="true" />
              <span>{t('home.fears.ctaNote')}</span>
            </p>
          </div>
        </div>

        {/* Список опасений + гарантия */}
        <div className={styles.items}>
          <ul className={styles.list}>
            {items.map((item, i) => {
              const Icon = FEAR_ICONS[i] ?? FEAR_ICONS[0];
              return (
                <li key={item.fear} className={styles.item}>
                  <IconBadge icon={<Icon />} size="md" tone="surface" className={styles.itemIcon} />
                  <div className={styles.itemBody}>
                    <p className={styles.fear}>{item.fear}</p>
                    <p className={styles.answer}>{item.answer}</p>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className={styles.guarantee}>
            <IconShield className={styles.guaranteeIcon} aria-hidden="true" />
            <span>
              <strong className={styles.guaranteeLead}>{t('home.fears.guaranteeLead')}</strong>{' '}
              {t('home.fears.guarantee')}
            </span>
          </div>
        </div>
      </Container>
    </section>
  );
}
