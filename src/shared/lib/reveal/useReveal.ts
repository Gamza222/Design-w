import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

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
      gsap.registerPlugin(useGSAP, ScrollTrigger);
      const targets = ref.current?.querySelectorAll('[data-reveal]');
      if (!targets || targets.length === 0) return;

      const media = gsap.matchMedia();
      media.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from(targets, {
          y,
          duration,
          ease: 'power3.out',
          stagger,
          scrollTrigger: { trigger: ref.current, start, once },
        });
      });

      return () => media.revert();
    },
    { scope: ref },
  );

  return ref;
}
