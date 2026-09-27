import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

import { LocaleSwitcher } from '@features/locale-switcher';
import { CONTACTS, HOME_SECTIONS, ROUTES, homeSectionPath, stripLocale } from '@shared/config';
import { cn, useHydrated, usePreloaderDone } from '@shared/lib';
import { AppLink, Button, Container, Logo, SocialLinks } from '@shared/ui';

import { useHeaderScroll } from '../../lib/useHeaderScroll';
import { Burger } from '../Burger/Burger';
import { HeaderContacts } from '../HeaderContacts/HeaderContacts';
import { HeaderNav } from '../HeaderNav/HeaderNav';
import styles from './Header.module.scss';

export function Header() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const scrolled = useHeaderScroll();
  const root = useRef<HTMLElement>(null);
  const hydrated = useHydrated();
  const preloaderDone = usePreloaderDone();

  // Хедер прозрачный (светлый текст) только над тёмным Hero главной. На остальных страницах
  // верх контента светлый — держим сплошную navy-подложку с самого верха, иначе светлая
  // навигация «пропадает» на светлом фоне (нечитабельна). Тёмный тон = текст всегда контрастен.
  const isHome = stripLocale(pathname) === ROUTES.home;
  const solid = scrolled || open || !isHome;

  const close = () => setOpen(false);

  // Закрываем мобильное меню при клике вне хедера
  useEffect(() => {
    if (!open) return;
    const handler = (e: PointerEvent) => {
      if (root.current && !root.current.contains(e.target as Node)) close();
    };
    document.addEventListener('pointerdown', handler);
    const menu = root.current?.querySelector<HTMLElement>('#header-menu');
    const opener = root.current?.querySelector<HTMLElement>('[aria-controls="header-menu"]');
    // Safari may leave focus on the previous element after a pointer click on a button.
    const focusOrigin = document.activeElement;
    const focusDeadline = performance.now() + 500;
    let focusFrame = 0;
    const focusMenu = () => {
      // Stop if the user has already moved focus. Opening CSS can still be hidden
      // on the first frame, and a reduced-motion transition may end before this
      // effect runs, so retry briefly instead of depending on transitionend.
      if (document.activeElement !== opener && document.activeElement !== focusOrigin) return;
      const firstLink = menu?.querySelector<HTMLElement>('a[href]');
      if (firstLink && getComputedStyle(firstLink).visibility === 'visible') {
        firstLink.focus({ preventScroll: true });
        if (document.activeElement === firstLink) return;
      }
      if (performance.now() < focusDeadline) focusFrame = requestAnimationFrame(focusMenu);
    };
    focusFrame = requestAnimationFrame(focusMenu);
    const desktop = window.matchMedia('(min-width: 1280px)');
    const onDesktop = () => {
      if (desktop.matches) close();
    };
    desktop.addEventListener('change', onDesktop);
    return () => {
      document.removeEventListener('pointerdown', handler);
      desktop.removeEventListener('change', onDesktop);
      cancelAnimationFrame(focusFrame);
    };
  }, [open]);

  // Входная анимация — часть флоу «сначала прелоадер, потом сайт»: хедер появляется, КОГДА шторка
  // уходит (preloaderDone). useGSAP = layout-effect (до пейнта), prerendered HTML сохраняет разметку →
  // SEO/гидрация не страдают. Анимируем сам <header> (не .inner): остаточный transform от GSAP делает
  // элемент containing-block'ом, поэтому fixed-панель мобильного меню должна считаться от <header>
  // (top:0), а не от вертикально-центрированного .inner — иначе панель уезжает на ~20px вниз.
  useGSAP(
    () => {
      if (!root.current) return;
      const media = gsap.matchMedia();
      media.add('(prefers-reduced-motion: no-preference)', () => {
        if (!preloaderDone) {
          gsap.set(root.current, { autoAlpha: 0, y: -20 });
          return;
        }
        gsap.fromTo(
          root.current,
          { autoAlpha: 0, y: -20 },
          { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out' },
        );
      });
      return () => media.revert();
    },
    { scope: root, dependencies: [preloaderDone], revertOnUpdate: true },
  );

  return (
    <header
      ref={root}
      className={cn(styles.header, solid && styles.scrolled, open && styles.menuExpanded)}
      onKeyDown={(event) => {
        if (open && event.key === 'Escape' && !event.defaultPrevented) {
          close();
          root.current?.querySelector<HTMLElement>('[aria-controls="header-menu"]')?.focus();
        }
      }}
      onBlur={(event) => {
        if (open && event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) {
          close();
        }
      }}
    >
      <Container className={styles.inner}>
        <AppLink to={ROUTES.home} className={styles.brand} aria-label={t('brand')} onClick={close}>
          <Logo title={t('brand')} className={styles.brandMark} aria-hidden="true" />
          <span className={styles.wordmark} aria-hidden="true">
            {t('brand')}
          </span>
        </AppLink>

        <div id="header-menu" className={cn(styles.menu, open && styles.menuOpen)}>
          <HeaderNav onNavigate={close} className={styles.nav} />

          <div className={styles.actions}>
            <SocialLinks items={CONTACTS.socials} />
            <HeaderContacts />
            <div className={styles.lang}>
              <LocaleSwitcher />
            </div>
            <Button
              to={homeSectionPath(HOME_SECTIONS.calculator)}
              className={styles.cta}
              onClick={close}
            >
              {t('cta.calculate')}
            </Button>
          </div>
        </div>

        <Burger
          open={open}
          disabled={!hydrated}
          aria-label={t('header.menu')}
          aria-controls="header-menu"
          onClick={() => setOpen((value) => !value)}
        />
      </Container>
    </header>
  );
}
