import { useRef, type ReactNode } from 'react';
import { useLocation } from 'react-router';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollSmoother);

interface SmoothScrollProps {
  children: ReactNode;
}

export function SmoothScroll({ children }: SmoothScrollProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();

  useGSAP(
    () => {
      // ScrollSmoother is a singleton — reuse any existing instance instead of
      // creating a second one (guards against StrictMode/HMR double-invoke).
      const smoother =
        ScrollSmoother.get() ??
        ScrollSmoother.create({
          wrapper: '#smooth-wrapper',
          content: '#smooth-content',
          smooth: 1.2,
          effects: true,
        });
      return () => smoother.kill();
    },
    { scope: wrapperRef },
  );

  // Content height changes on SPA navigation — recalculate against the live instance.
  useGSAP(
    () => {
      ScrollSmoother.get()?.refresh();
    },
    { dependencies: [pathname] },
  );

  return (
    <div id="smooth-wrapper" ref={wrapperRef}>
      <div id="smooth-content">{children}</div>
    </div>
  );
}
