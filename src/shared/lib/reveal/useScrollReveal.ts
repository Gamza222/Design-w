import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

import { usePreloaderDone } from '../preloader/preloaderSignal';

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface ScrollRevealOptions {
  /** Стартовый сдвиг по Y (px). */
  y?: number;
  duration?: number;
  stagger?: number;
  /** ScrollTrigger start (по умолчанию «top 82%»). */
  start?: string;
  ease?: string;
  /** Триггер — CSS-селектор внутри секции; по умолчанию корень scope. */
  trigger?: string;
}

/**
 * Единое появление по скроллу для секций сайта (заменяет дублирующийся `useGSAP`-блок в каждом
 * виджете — одинаковая длительность/ease/каскад везде). Возвращает ref на корень секции (scope);
 * `selector` (один или список) ищется внутри scope и всплывает (fade-up) каскадом.
 *
 * Ждёт ухода прелоадера: пока шторка на экране — цели держатся скрытыми и НЕ проигрываются (иначе
 * секции первого экрана отыграли бы за непрозрачной шторкой и зритель бы их не увидел). После ухода —
 * видимые секции появляются сразу, остальные по мере прокрутки. Уважает prefers-reduced-motion.
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  selector: string | string[],
  options: ScrollRevealOptions = {},
) {
  const ref = useRef<T>(null);
  const done = usePreloaderDone();
  const { y = 24, duration = 0.7, stagger = 0.08, start = 'top 82%', ease = 'power3.out', trigger } =
    options;

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const targets = Array.isArray(selector) ? selector.join(', ') : selector;

      // Пока прелоадер не ушёл — просто прячем (под шторкой), без триггера.
      if (!done) {
        gsap.set(targets, { autoAlpha: 0, y });
        return;
      }

      // fromTo с явными краями: устойчиво к повторному запуску эффекта (иначе gsap.from записал бы
      // текущее — уже скрытое — состояние как конечное и анимировал бы 0→0).
      gsap.fromTo(
        targets,
        { autoAlpha: 0, y },
        {
          autoAlpha: 1,
          y: 0,
          duration,
          ease,
          stagger,
          scrollTrigger: { trigger: trigger ?? ref.current, start, once: true },
        },
      );
    },
    { scope: ref, dependencies: [done] },
  );

  return ref;
}
