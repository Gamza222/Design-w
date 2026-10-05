import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

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

/** Small scroll entrance. Text remains visible even when animation frames stall.
 * Reduced motion reverts all transforms without waiting for a scroll trigger. */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  selector: string | string[],
  options: ScrollRevealOptions = {},
) {
  const ref = useRef<T>(null);
  const {
    y = 24,
    duration = 0.7,
    stagger = 0.08,
    start = 'top 82%',
    ease = 'power3.out',
    trigger,
  } = options;

  useGSAP(
    () => {
      gsap.registerPlugin(useGSAP, ScrollTrigger);
      const targets = Array.isArray(selector) ? selector.join(', ') : selector;
      const media = gsap.matchMedia();

      media.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          targets,
          { y },
          {
            y: 0,
            duration,
            clearProps: 'transform',
            ease,
            stagger,
            scrollTrigger: { trigger: trigger ?? ref.current, start, once: true },
          },
        );
      });

      return () => media.revert();
    },
    { scope: ref },
  );

  return ref;
}
