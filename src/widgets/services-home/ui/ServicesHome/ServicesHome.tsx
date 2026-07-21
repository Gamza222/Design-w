import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { cn, useScrollReveal } from '@shared/lib';
import {
  Container,
  IconBadge,
  IconContract,
  IconGlobe,
  IconHeadset,
  IconRuble,
  SectionHeader,
} from '@shared/ui';

import { resultImages } from '../../config/images';
import { OFFERS } from '../../model/offers';
import type { Offer, OfferId } from '../../model/types';
import { OfferCard } from '../OfferCard/OfferCard';
import { OfferModal } from '../OfferModal/OfferModal';
import { REQUEST_FORM_ID, ServicesCta } from '../ServicesCta/ServicesCta';
import styles from './ServicesHome.module.scss';

// Иконки строки преимуществ — по порядку i18n-массива home.services.perks.
const PERK_ICONS = [IconRuble, IconContract, IconGlobe, IconHeadset];

interface Perk {
  title: string;
  desc: string;
}

/** Блок «Наши услуги»: шапка, строка преимуществ, сетка 4 крупных + 6 компактных карточек,
 *  снизу «Кому подойдут» + тёмная панель с формой. Детали услуги — в модальном окне
 *  (без раскрытия вниз и перехода на отдельную страницу). */
export function ServicesHome() {
  const { t } = useTranslation();
  const [openedId, setOpenedId] = useState<OfferId | null>(null);
  // Карточка, открывшая модалку, — для возврата фокуса после закрытия.
  const triggerRef = useRef<HTMLElement | null>(null);

  // Reveal — на обёртках .cell, а не на самих карточках: GSAP оставляет инлайновый
  // transform на целях, который перебил бы hover-подъём кнопки-карточки.
  // Нижний блок с формой не анимируем: он далеко под триггером (эффект всё равно не виден),
  // а autoAlpha прятал бы цель фокуса «Заказать этот пакет» (focus по visibility:hidden — no-op).
  const root = useScrollReveal<HTMLElement>(
    [`.${styles.header}`, `.${styles.perks}`, `.${styles.cell}`],
    { y: 28, duration: 0.85, stagger: 0.07 }, // чуть мягче и медленнее общего дефолта
  );

  const perks = t('home.services.perks', { returnObjects: true }) as Perk[];
  const opened = OFFERS.find((o) => o.id === openedId) ?? null;

  const openOffer = (offer: Offer, trigger: HTMLElement) => {
    triggerRef.current = trigger;
    setOpenedId(offer.id);
  };

  const closeModal = () => {
    setOpenedId(null);
    triggerRef.current?.focus();
    triggerRef.current = null;
  };

  // «Заказать этот пакет»: закрыть модалку и подвести к форме заявки внизу блока.
  const orderFromModal = () => {
    setOpenedId(null);
    triggerRef.current = null;
    requestAnimationFrame(() => {
      const target = document.getElementById(REQUEST_FORM_ID);
      if (!target) return;
      target.focus({ preventScroll: true });
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
    });
  };

  return (
    <section className={styles.services} ref={root}>
      <Container>
        <SectionHeader
          className={styles.header}
          align="center"
          eyebrow={t('home.services.eyebrow')}
          title={t('home.services.title')}
          subtitle={t('home.services.subtitle')}
        />

        <ul className={styles.perks}>
          {perks.map((perk, i) => {
            const PerkIcon = PERK_ICONS[i] ?? IconRuble;
            return (
              <li key={perk.title} className={styles.perk}>
                <IconBadge icon={<PerkIcon />} size="sm" tone="outline" />
                <span className={styles.perkText}>
                  <span className={styles.perkTitle}>{perk.title}</span>
                  <span className={styles.perkDesc}>{perk.desc}</span>
                </span>
              </li>
            );
          })}
        </ul>

        <div className={styles.grid}>
          {OFFERS.map((offer) => (
            <div key={offer.id} className={cn(styles.cell, offer.size === 'sm' && styles.cellSm)}>
              <OfferCard offer={offer} image={resultImages[offer.image]} onOpen={openOffer} />
            </div>
          ))}
        </div>

        <ServicesCta className={styles.bottom} />
      </Container>

      {opened && (
        <OfferModal
          offer={opened}
          onClose={closeModal}
          onSwitch={setOpenedId}
          onOrder={orderFromModal}
        />
      )}
    </section>
  );
}