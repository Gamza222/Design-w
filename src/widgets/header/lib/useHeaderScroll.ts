import { useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP, ScrollTrigger);
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
