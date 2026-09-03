import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';

import {
  Button,
  IconArmchair,
  IconBadge,
  IconChat,
  IconCheck,
  IconClock,
  IconClose,
  IconEdit,
  IconFolderCheck,
  IconHardHat,
  IconLightbulb,
  IconMapPin,
  Image,
} from '@shared/ui';

import { resultImages } from '../../config/images';
import { OFFERS } from '../../model/offers';
import type { Offer, OfferId } from '../../model/types';
import styles from './OfferModal.module.scss';

interface OfferModalProps {
  offer: Offer;
  onClose: () => void;
  /** Переключить услугу внутри открытой модалки (блок «Дополнительно»). */
  onSwitch: (id: OfferId) => void;
  /** «Заказать этот пакет» — родитель закрывает модалку и ведёт к форме заявки. */
  onOrder: () => void;
}

const SPEC_ICONS = {
  term: IconClock,
  revisions: IconEdit,
  format: IconFolderCheck,
  coverage: IconMapPin,
} as const;

const SPEC_KEYS = ['term', 'revisions', 'format', 'coverage'] as const;

// Иконки мини-карточек «Дополнительно» (референс: иконка + название + цена).
const ADDON_ICONS: Partial<Record<OfferId, typeof IconChat>> = {
  supervision: IconHardHat,
  ergonomics: IconArmchair,
  prelaunch: IconChat,
};

const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Модальное окно услуги: слева — состав, характеристики и цена, справа — «Что вы получите»
 * с изображениями и доп. услуги. Рендерится порталом в body только в открытом состоянии
 * (после гидрации — document доступен). Закрытие: крестик, клик по подложке, Escape.
 * Скролл страницы блокируется, фокус зациклен внутри; возврат фокуса делает родитель.
 */
export function OfferModal({ offer, onClose, onSwitch, onOrder }: OfferModalProps) {
  const { t } = useTranslation();
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  // Клик по подложке закрывает только если и нажатие началось на ней —
  // иначе выделение текста с отпусканием мыши на фоне захлопывало бы окно.
  const pressedOnBackdrop = useRef(false);

  const base = `home.services.items.${offer.id}`;
  const includes = t(`${base}.includes`, { returnObjects: true }) as string[];
  const addons = OFFERS.filter((candidate) => offer.addons?.includes(candidate.id));

  // Блокировка прокрутки страницы на время жизни модалки (+ компенсация скроллбара — без сдвига).
  useEffect(() => {
    const body = document.body;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    const prevOverflow = body.style.overflow;
    const prevPadding = body.style.paddingRight;
    body.style.overflow = 'hidden';
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;
    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPadding;
    };
  }, []);

  // Escape — закрыть; Tab — зациклить фокус внутри диалога.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;
      const root = dialogRef.current;
      if (!root) return;
      const focusables = Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (!active || !root.contains(active) || active === root) {
        (e.shiftKey ? last : first).focus();
        e.preventDefault();
      } else if (e.shiftKey && active === first) {
        last.focus();
        e.preventDefault();
      } else if (!e.shiftKey && active === last) {
        first.focus();
        e.preventDefault();
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  // При открытии и переключении услуги («Дополнительно»): скролл контента в начало.
  // Фокус — на сам скроллер: стрелки/PageDown листают контент сразу (скроллятся только
  // сфокусированный элемент и его предки, а диалог с overflow:hidden не скроллится).
  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: 0 });
    scrollerRef.current?.focus();
  }, [offer.id]);

  return createPortal(
    <div
      className={styles.overlay}
      role="presentation"
      onMouseDown={(e) => {
        pressedOnBackdrop.current = e.target === e.currentTarget;
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && pressedOnBackdrop.current) onClose();
      }}
    >
      <div
        ref={dialogRef}
        className={styles.dialog}
        data-tone="paper"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <button
          type="button"
          className={styles.close}
          onClick={onClose}
          aria-label={t('home.services.modal.close')}
        >
          <IconClose aria-hidden="true" />
        </button>

        <div className={styles.scroller} ref={scrollerRef} tabIndex={-1}>
          <div className={styles.columns}>
            {/* Левая колонка: номер, название, состав, характеристики, для кого, цена */}
            <div className={styles.left}>
              <header className={styles.head}>
                <div className={styles.headTop}>
                  <span className={styles.num} aria-hidden="true">
                    {offer.num}
                  </span>
                  {offer.popular && (
                    <span className={styles.popularBadge}>{t('home.services.popularPackage')}</span>
                  )}
                </div>
                <h3 className={styles.title} id={titleId}>
                  {t(`${base}.name`)}
                </h3>
                <p className={styles.desc}>{t(`${base}.desc`)}</p>
              </header>

              <h4 className={styles.blockTitle}>{t('home.services.modal.includesTitle')}</h4>
              <ul className={styles.includes}>
                {includes.map((item) => (
                  <li key={item} className={styles.includesItem}>
                    <IconCheck aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>

              {offer.hasNote && <p className={styles.note}>{t(`${base}.note`)}</p>}

              <hr className={styles.divider} />

              <ul className={styles.specs}>
                {SPEC_KEYS.map((key) => {
                  const SpecIcon = SPEC_ICONS[key];
                  return (
                    <li key={key} className={styles.spec}>
                      <SpecIcon className={styles.specIcon} aria-hidden="true" />
                      <span className={styles.specLabel}>
                        {t(`home.services.modal.specLabels.${key}`)}
                      </span>
                      <span className={styles.specValue}>{t(`${base}.specs.${key}`)}</span>
                    </li>
                  );
                })}
              </ul>

              <div className={styles.forWhom}>
                <IconBadge icon={<IconLightbulb />} tone="accent" className={styles.forWhomIcon} />
                <div>
                  <p className={styles.forWhomTitle}>{t('home.services.modal.forWhomTitle')}</p>
                  <p className={styles.forWhomText}>{t(`${base}.forWhom`)}</p>
                </div>
              </div>

              <div className={styles.order}>
                <span className={styles.price}>{t(`${base}.price`)}</span>
                <Button size="lg" onClick={onOrder} className={styles.orderBtn}>
                  {t('home.services.modal.order')}
                </Button>
              </div>
            </div>

            {/* Правая колонка: «Что вы получите» + доп. услуги */}
            <aside className={styles.right}>
              <h4 className={styles.blockTitle}>{t('home.services.modal.receiveTitle')}</h4>

              {offer.hasReceiveList ? (
                <ul className={styles.receiveList}>
                  {(t(`${base}.receive`, { returnObjects: true }) as string[]).map((item) => (
                    <li key={item} className={styles.receiveItem}>
                      <IconCheck aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className={styles.gallery}>
                  {offer.gallery.map((slot) => (
                    <li key={slot}>
                      <figure className={styles.figure}>
                        <Image
                          src={resultImages[slot].src}
                          className={styles.galleryPhoto}
                          style={{ objectPosition: resultImages[slot].position }}
                        />
                        <figcaption className={styles.caption}>
                          {t(`home.services.slots.${slot}`)}
                        </figcaption>
                      </figure>
                    </li>
                  ))}
                </ul>
              )}

              {addons.length > 0 && (
                <div className={styles.addons}>
                  <h4 className={styles.addonsTitle}>{t('home.services.modal.addonsTitle')}</h4>
                  <div className={styles.addonsList}>
                    {addons.map((addon) => {
                      const AddonIcon = ADDON_ICONS[addon.id] ?? IconChat;
                      return (
                        <button
                          key={addon.id}
                          type="button"
                          className={styles.addon}
                          onClick={() => onSwitch(addon.id)}
                        >
                          <AddonIcon className={styles.addonIcon} aria-hidden="true" />
                          <span className={styles.addonName}>
                            {t(`home.services.items.${addon.id}.name`)}
                          </span>
                          <span className={styles.addonPrice}>
                            {t(`home.services.items.${addon.id}.price`)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
