import { useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP, ScrollTrigger);
export function useHeaderScroll(threshold = 24): boolean {
  const [scrolled, setScrolled] = useState(false);

  useGSAP(() => {
    // Два порога дают гистерезис: стекло включается после 24px, а выключается только
    // почти у самого верха. При инерционном скролле и субпиксельных колебаниях вокруг
    // одного порога класс больше не переключается туда-сюда и нижняя «бровь» не фликает.
    const enterTrigger = ScrollTrigger.create({
      start: threshold,
      onEnter: () => setScrolled(true),
    });

    const leaveTrigger = ScrollTrigger.create({
      start: 2,
      onLeaveBack: () => setScrolled(false),
    });

    return () => {
      enterTrigger.kill();
      leaveTrigger.kill();
    };
  }, []);

  return scrolled;
}
