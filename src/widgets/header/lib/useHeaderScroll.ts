import { useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

// Плагины уже регистрируются в app/smooth-scroll/SmoothScroll.tsx; повторная регистрация
// идемпотентна и страхует, если хук смонтируется раньше смуса.
gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * `true`, когда страница прокручена ниже порога (px). Header — fixed-сосед ВНЕ
 * `#smooth-content`, скролл проксирует ScrollSmoother, поэтому ловим позицию через
 * ScrollTrigger (числовой `start`), а не через `window.scrollY`.
 *
 * Порог маленький (10px): фон хедера меняется сразу при начале скролла вниз, а не «поздно».
 * Небольшой буфер (не 0) защищает от дребезга у самого верха при сабпиксельном скролле.
 */
export function useHeaderScroll(threshold = 10): boolean {
  const [scrolled, setScrolled] = useState(false);

  useGSAP(() => {
    // end намеренно не задаём: onToggle + isActive ложно сбрасывался у самого дна страницы.
    // onEnter / onLeaveBack дают ровно нужное: появился → навсегда, ушёл вверх → скрылся.
    const trigger = ScrollTrigger.create({
      start: threshold,
      onEnter: () => setScrolled(true),
      onLeaveBack: () => setScrolled(false),
    });
    return () => trigger.kill();
  }, []);

  return scrolled;
}
