import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

import { LocaleSwitcher } from '@features/locale-switcher';
import { CONTACTS, ROUTES, stripLocale } from '@shared/config';
import { cn, usePreloaderDone } from '@shared/lib';
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
    return () => document.removeEventListener('pointerdown', handler);
  }, [open]);

  // Входная анимация — часть флоу «сначала прелоадер, потом сайт»: хедер появляется, КОГДА шторка
  // уходит (preloaderDone). useGSAP = layout-effect (до пейнта), prerendered HTML сохраняет разметку →
  // SEO/гидрация не страдают. Анимируем сам <header> (не .inner): остаточный transform от GSAP делает
  // элемент containing-block'ом, поэтому fixed-панель мобильного меню должна считаться от <header>
  // (top:0), а не от вертикально-центрированного .inner — иначе панель уезжает на ~20px вниз.
  useGSAP(
    () => {
      if (!root.current) return;
      // Уважаем prefers-reduced-motion: без анимации хедер сразу видим и стабилен.
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      if (!preloaderDone) {
        gsap.set(root.current, { autoAlpha: 0, y: -20 });
        return;
      }
      gsap.fromTo(
        root.current,
        { autoAlpha: 0, y: -20 },
        { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out' },
      );
    },
    { scope: root, dependencies: [preloaderDone] },
  );

  return (
    <header ref={root} className={cn(styles.header, solid && styles.scrolled)}>
      <Container className={styles.inner}>
        <AppLink to={ROUTES.home} className={styles.brand} onClick={close}>
          <Logo title={t('brand')} style={{ height: 'var(--space-8)' }} />
        </AppLink>

        <div id="header-menu" className={cn(styles.menu, open && styles.menuOpen)}>
          <HeaderNav onNavigate={close} className={styles.nav} />

          <div className={styles.actions}>
            <SocialLinks items={CONTACTS.socials} />
            <HeaderContacts />
            <div className={styles.lang}>
              <LocaleSwitcher />
            </div>
            <Button to={ROUTES.contact} className={styles.cta} onClick={close}>
              {t('cta.calculate')}
            </Button>
          </div>
        </div>

        <Burger
          open={open}
          aria-label={t('header.menu')}
          aria-controls="header-menu"
          onClick={() => setOpen((value) => !value)}
        />
      </Container>
    </header>
  );
}
