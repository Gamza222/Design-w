import {
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';

import { cn, useScrollReveal } from '@shared/lib';
import { HOME_SECTIONS } from '@shared/config';
import {
  Container,
  IconArrowRight,
  IconBadge,
  IconContract,
  IconGlobe,
  IconHeadset,
  IconRuble,
  SectionHeader,
} from '@shared/ui';

import { OFFERS } from '../../model/offers';
import type { Offer, OfferId } from '../../model/types';
import { OfferCard } from '../OfferCard/OfferCard';
import { OfferModal } from '../OfferModal/OfferModal';
import { OrderModal } from '../OrderModal/OrderModal';
import { ServicesCta } from '../ServicesCta/ServicesCta';
import styles from './ServicesHome.module.scss';

// Иконки строки преимуществ — по порядку i18n-массива home.services.perks.
const PERK_ICONS = [IconRuble, IconContract, IconGlobe, IconHeadset];

interface Perk {
  title: string;
  desc: string;
}

/** Порог, после которого отпускание drag'а НЕ считается кликом по карточке. */
const DRAG_CLICK_THRESHOLD = 6;

/** Поведение прокрутки ленты: плавно, только если пользователь не просил reduced-motion. */
const scrollBehavior = (): ScrollBehavior =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';

/** Блок «Наши услуги»: шапка со стрелками, строка преимуществ и компактная лента-карусель
 *  (нативный scroll-snap + drag мышью + прогресс). Обрезанная карточка у правого края —
 *  «крючок» листания. Детали услуги — в модальном окне, снизу «Кому подойдут» + форма. */
export function ServicesHome() {
  const { t } = useTranslation();
  const [openedId, setOpenedId] = useState<OfferId | null>(null);
  const [orderedId, setOrderedId] = useState<OfferId | null>(null);
  // Карточка, открывшая модалку, — для возврата фокуса после закрытия.
  const triggerRef = useRef<HTMLElement | null>(null);

  const root = useScrollReveal<HTMLElement>(
    [`.${styles.header}`, `.${styles.perks}`, `.${styles.nav}`, `.${styles.track}`],
    { y: 28, duration: 0.85, stagger: 0.07 },
  );

  const perks = t('home.services.perks', { returnObjects: true }) as Perk[];
  const opened = OFFERS.find((o) => o.id === openedId) ?? null;
  const ordered = OFFERS.find((o) => o.id === orderedId) ?? null;

  // --- Карусель ---------------------------------------------------------------
  const trackRef = useRef<HTMLDivElement | null>(null);
  // Прогресс-полоса ведётся мимо React (transform пишем напрямую) — scroll-ивенты
  // не должны ре-рендерить секцию десятки раз в секунду.
  const progressRef = useRef<HTMLElement | null>(null);
  const syncRaf = useRef(0);
  const [scroll, setScroll] = useState({ atStart: true, atEnd: false, index: 0 });
  const [dragging, setDragging] = useState(false);
  const drag = useRef({ startX: 0, startLeft: 0, moved: 0 });

  // Шаг = ширина карточки + gap ленты (первый ребёнок — карточка).
  const step = useCallback(() => {
    const track = trackRef.current;
    const card = track?.firstElementChild as HTMLElement | null;
    if (!track || !card) return 1;
    return card.getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || '0');
  }, []);

  // Синхронизация состояния ленты: не чаще кадра (rAF-троттлинг), setState — только
  // при реальной смене краёв/индекса (bail-out тем же объектом).
  const syncScroll = useCallback(() => {
    if (syncRaf.current) return;
    syncRaf.current = requestAnimationFrame(() => {
      syncRaf.current = 0;
      const track = trackRef.current;
      if (!track) return;
      const max = track.scrollWidth - track.clientWidth;
      const progress = max > 0 ? track.scrollLeft / max : 1;
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${Math.max(0.04, progress)})`;
      }
      const atStart = track.scrollLeft < 10;
      const atEnd = track.scrollLeft > max - 10;
      // В конце ленты счётчик показывает последнюю карточку, а не левую видимую.
      const index = atEnd
        ? OFFERS.length - 1
        : Math.min(OFFERS.length - 1, Math.round(track.scrollLeft / step()));
      setScroll((prev) =>
        prev.atStart === atStart && prev.atEnd === atEnd && prev.index === index
          ? prev
          : { atStart, atEnd, index },
      );
    });
  }, [step]);

  // Первичный расчёт + пересчёт при ресайзе (иначе края/прогресс протухают после
  // изменения ширины окна или поворота планшета).
  useEffect(() => {
    syncScroll();
    window.addEventListener('resize', syncScroll);
    return () => {
      window.removeEventListener('resize', syncScroll);
      cancelAnimationFrame(syncRaf.current);
      syncRaf.current = 0;
    };
  }, [syncScroll]);

  const scrollByCards = (dir: 1 | -1) =>
    trackRef.current?.scrollBy({ left: dir * step() * 2, behavior: scrollBehavior() });

  // Drag-to-scroll мышью (тач листает ленту нативно). Только левая кнопка:
  // правый клик открывает контекстное меню и может «съесть» pointerup.
  const onPointerDown = (e: ReactPointerEvent) => {
    if (e.pointerType !== 'mouse' || e.button !== 0 || !trackRef.current) return;
    drag.current = { startX: e.clientX, startLeft: trackRef.current.scrollLeft, moved: 0 };
    setDragging(true);
  };

  useEffect(() => {
    if (!dragging) return;

    const finishDrag = () => {
      setDragging(false);
      const track = trackRef.current;
      // Доснап к ближайшей карточке — только после реального drag'а:
      // простой клик не должен сдвигать ленту под курсором.
      if (track && drag.current.moved > DRAG_CLICK_THRESHOLD) {
        const s = step();
        track.scrollTo({ left: Math.round(track.scrollLeft / s) * s, behavior: scrollBehavior() });
      }
      // click прилетает вслед за pointerup — порог обнуляем отдельным таском, иначе
      // протухшее значение проглотит следующую клавиатурную/тач-активацию карточки.
      window.setTimeout(() => {
        drag.current.moved = 0;
      }, 0);
    };

    const onMove = (e: PointerEvent) => {
      const track = trackRef.current;
      if (!track) return;
      // Кнопку уже отпустили, а pointerup не дошёл (например, контекстное меню) — завершаем жест.
      if (e.buttons === 0) {
        finishDrag();
        return;
      }
      const dx = e.clientX - drag.current.startX;
      drag.current.moved = Math.max(drag.current.moved, Math.abs(dx));
      track.scrollLeft = drag.current.startLeft - dx;
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', finishDrag);
    window.addEventListener('pointercancel', finishDrag);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', finishDrag);
      window.removeEventListener('pointercancel', finishDrag);
    };
  }, [dragging, step]);

  // --- Модалка ----------------------------------------------------------------
  // useCallback — стабильный проп для memo(OfferCard): скролл-состояние ленты
  // не должно перерисовывать все 10 карточек.
  const openOffer = useCallback((offer: Offer, trigger: HTMLElement) => {
    // Отпускание drag'а над карточкой — не клик.
    if (drag.current.moved > DRAG_CLICK_THRESHOLD) return;
    triggerRef.current = trigger;
    setOpenedId(offer.id);
  }, []);

  const closeModal = () => {
    setOpenedId(null);
    triggerRef.current?.focus();
    triggerRef.current = null;
  };

  // «Заказать этот пакет»: сохранить выбранную услугу и открыть полную форму.
  const orderFromModal = () => {
    if (!openedId) return;
    setOrderedId(openedId);
    setOpenedId(null);
  };

  const closeOrder = () => {
    setOrderedId(null);
    triggerRef.current?.focus();
    triggerRef.current = null;
  };

  return (
    <section
      id={HOME_SECTIONS.services}
      className={styles.services}
      data-tone="light"
      ref={root}
    >
      <Container>
        {/* Шапка: на мобильных стрелки уезжают под преимущества — вплотную к ленте. */}
        <div className={styles.headRow}>
          <SectionHeader
            className={styles.header}
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
          {/* aria-disabled вместо disabled — кнопка на краю ленты не выпадает из tab-order. */}
          <div className={styles.nav}>
            <button
              type="button"
              className={styles.navBtn}
              aria-disabled={scroll.atStart}
              onClick={() => {
                if (!scroll.atStart) scrollByCards(-1);
              }}
              aria-label={t('home.services.carousel.prev')}
            >
              <IconArrowRight aria-hidden="true" style={{ transform: 'rotate(180deg)' }} />
            </button>
            <button
              type="button"
              className={styles.navBtn}
              aria-disabled={scroll.atEnd}
              onClick={() => {
                if (!scroll.atEnd) scrollByCards(1);
              }}
              aria-label={t('home.services.carousel.next')}
            >
              <IconArrowRight aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Лента услуг: нативный горизонтальный скролл со снапом; drag мышью.
            Fade-маска — только со стороны, где лента реально продолжается. */}
        <div
          ref={trackRef}
          className={cn(
            styles.track,
            dragging && styles.trackDragging,
            !scroll.atStart && styles.maskStart,
            !scroll.atEnd && styles.maskEnd,
          )}
          role="group"
          aria-label={t('home.services.carousel.trackLabel')}
          onScroll={syncScroll}
          onPointerDown={onPointerDown}
        >
          {OFFERS.map((offer) => (
            <OfferCard key={offer.id} offer={offer} onOpen={openOffer} />
          ))}
        </div>

        <div className={styles.progressRow}>
          <div className={styles.progress} aria-hidden="true">
            <i ref={progressRef} className={styles.progressBar} />
          </div>
          {/* Живой счётчик — позиция «03 / 10» озвучивается после листания стрелками. */}
          <span className={styles.counter} aria-live="polite">
            <b>{String(scroll.index + 1).padStart(2, '0')}</b> / {OFFERS.length}
          </span>
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
      {ordered && <OrderModal offer={ordered} onClose={closeOrder} />}
    </section>
  );
}
