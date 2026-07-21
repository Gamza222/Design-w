import { useTranslation } from 'react-i18next';

import { cn } from '@shared/lib';
import { IconArrowRight, Image } from '@shared/ui';

import type { Offer } from '../../model/types';
import styles from './OfferCard.module.scss';

interface OfferCardProps {
  offer: Offer;
  /** Изображение слота услуги (см. config/images.ts). */
  image: { src: string; position?: string };
  /** Открыть модалку; trigger — сама карточка (для возврата фокуса после закрытия). */
  onOpen: (offer: Offer, trigger: HTMLElement) => void;
}

/** Кликабельная карточка услуги: фото → номер → название → описание → цена + «Что входит →».
 *  Крупная (первый ряд) и компактная (второй) — один компонент, размер задаёт `offer.size`.
 *  Популярная — тёмная графитовая через data-tone="dark" (семантические токены перекрашивают всё). */
export function OfferCard({ offer, image, onOpen }: OfferCardProps) {
  const { t } = useTranslation();
  const base = `home.services.items.${offer.id}`;

  return (
    <button
      type="button"
      data-tone={offer.popular ? 'dark' : undefined}
      className={cn(styles.card, offer.size === 'sm' && styles.sm, offer.popular && styles.featured)}
      onClick={(e) => onOpen(offer, e.currentTarget)}
      aria-haspopup="dialog"
    >
      <span className={styles.media}>
        <Image src={image.src} className={styles.photo} style={{ objectPosition: image.position }} />
        {offer.popular && <span className={styles.badge}>{t('home.services.popular')}</span>}
      </span>

      <span className={styles.body}>
        {/* Номер декоративный — имя кнопки не начинается с «ноль один…» */}
        <span className={styles.num} aria-hidden="true">
          {offer.num}
        </span>
        <span className={styles.name}>{t(`${base}.name`)}</span>
        <span className={styles.desc}>{t(`${base}.cardDesc`)}</span>
        <span className={styles.footer}>
          <span className={styles.price}>{t(`${base}.price`)}</span>
          <span className={styles.more}>
            {t('home.services.whatsIncluded')}
            <IconArrowRight aria-hidden="true" />
          </span>
        </span>
      </span>
    </button>
  );
}