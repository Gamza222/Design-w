import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface RevealOptions {
  /** Сдвиг по Y перед появлением (px). */
  y?: number;
  duration?: number;
  stagger?: number;
  /** ScrollTrigger start (по умолчанию «top 85%»). */
  start?: string;
  once?: boolean;
}
export function useReveal<T extends HTMLElement = HTMLDivElement>(options: RevealOptions = {}) {
  const ref = useRef<T>(null);
  const { y = 24, duration = 0.8, stagger = 0.08, start = 'top 85%', once = true } = options;

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const targets = ref.current?.querySelectorAll('[data-reveal]');
      if (!targets || targets.length === 0) return;

      gsap.from(targets, {
        y,
        autoAlpha: 0,
        duration,
        ease: 'power3.out',
        stagger,
        scrollTrigger: { trigger: ref.current, start, once },
      });
    },
    { scope: ref },
  );

  return ref;
}
