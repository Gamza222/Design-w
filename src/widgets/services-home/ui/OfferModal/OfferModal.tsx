import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';

import { getTariff } from '@entities/package';
import { useLocale } from '@shared/lib';

import { Button, IconChat, IconCheck, IconClose, IconHardHat, Image } from '@shared/ui';

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

const ADDON_ICONS: Partial<Record<OfferId, typeof IconChat>> = {
  supervision: IconHardHat,
  consultation: IconChat,
};

const FOCUSABLE = 'a[href], button, input, select, textarea, [tabindex]';

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

  const locale = useLocale();
  const tariff = getTariff(offer.id, locale);
  const includes = tariff.includes;
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
      const focusables = Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (element) =>
          !element.matches(':disabled, [tabindex="-1"], [aria-hidden="true"]') &&
          element.getClientRects().length > 0,
      );
      if (focusables.length === 0) return;
      const active = document.activeElement as HTMLElement | null;
      const index = active ? focusables.indexOf(active) : -1;
      // Include buttons even when Safari's native Tab order skips them.
      const next =
        index < 0
          ? e.shiftKey
            ? focusables.length - 1
            : 0
          : (index + (e.shiftKey ? -1 : 1) + focusables.length) % focusables.length;
      e.preventDefault();
      focusables[next].focus();
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
                  {tariff.name}
                </h3>
                <p className={styles.desc}>{tariff.description}</p>
              </header>

              {includes.length > 0 && (
                <>
                  <h4 className={styles.blockTitle}>{t('home.services.modal.includesTitle')}</h4>
                  <ul className={styles.includes}>
                    {includes.map((item) => (
                      <li key={item} className={styles.includesItem}>
                        <IconCheck aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </>
              )}
              {tariff.exclusions.map((item) => (
                <p key={item} className={styles.note}>
                  {item}
                </p>
              ))}
              <p className={styles.note}>{t('tariffs.terms')}</p>

              <div className={styles.order}>
                <span className={styles.price}>{tariff.priceLabel}</span>
                <Button size="lg" onClick={onOrder} className={styles.orderBtn}>
                  {t('home.services.modal.order')}
                </Button>
              </div>
            </div>

            {/* Правая колонка: «Что вы получите» + доп. услуги */}
            <aside className={styles.right}>
              {offer.gallery.length > 0 && (
                <>
                  <h4 className={styles.blockTitle}>{t('home.services.modal.receiveTitle')}</h4>
                  <ul className={styles.gallery}>
                    {offer.gallery.map((slot) => (
                      <li key={slot}>
                        <figure className={styles.figure}>
                          <Image
                            src={resultImages[slot].src}
                            alt={t(`home.services.slots.${slot}`)}
                            sizes="(max-width: 767px) 90vw, 25vw"
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
                </>
              )}

              {addons.length > 0 && (
                <div className={styles.addons}>
                  <h4 className={styles.addonsTitle}>{t('home.services.modal.addonsTitle')}</h4>
                  <div className={styles.addonsList}>
                    {addons.map((addon) => {
                      const AddonIcon = ADDON_ICONS[addon.id] ?? IconChat;
                      const addonTariff = getTariff(addon.id, locale);
                      return (
                        <button
                          key={addon.id}
                          type="button"
                          className={styles.addon}
                          onClick={() => onSwitch(addon.id)}
                        >
                          <AddonIcon className={styles.addonIcon} aria-hidden="true" />
                          <span className={styles.addonName}>{addonTariff.name}</span>
                          <span className={styles.addonPrice}>{addonTariff.priceLabel}</span>
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
