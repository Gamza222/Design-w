import { useTranslation } from 'react-i18next';

import { IconArrowRight } from '@shared/ui';

import type { Offer } from '../../model/types';
import styles from './OfferCard.module.scss';

interface OfferCardProps {
  offer: Offer;
  /** Открыть модалку; trigger — сама карточка (для возврата фокуса после закрытия). */
  onOpen: (offer: Offer, trigger: HTMLElement) => void;
}

/** Компактная карточка ленты услуг: металлик-номер → название → описание → цена + стрелка.
 *  Фото нет — фактуру дают графит, градиентный борт и золотой прайс-чип; на hover карточка
 *  приподнимается, борт и стрелка вспыхивают. Детали услуги — в модалке (по клику). */
export function OfferCard({ offer, onOpen }: OfferCardProps) {
  const { t } = useTranslation();
  const base = `home.services.items.${offer.id}`;

  return (
    <button
      type="button"
      className={styles.card}
      onClick={(e) => onOpen(offer, e.currentTarget)}
      aria-haspopup="dialog"
    >
      {offer.popular && <span className={styles.badge}>{t('home.services.popular')}</span>}
      {/* Декоративный номер — имя кнопки не начинается с «ноль один…» */}
      <span className={styles.num} aria-hidden="true">
        {offer.num}
      </span>
      <span className={styles.name}>{t(`${base}.name`)}</span>
      <span className={styles.desc}>{t(`${base}.cardDesc`)}</span>
      <span className={styles.footer}>
        <span className={styles.price}>{t(`${base}.price`)}</span>
        <span className={styles.more} aria-hidden="true">
          <IconArrowRight />
        </span>
      </span>
    </button>
  );
}