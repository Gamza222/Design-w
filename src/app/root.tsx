import type { ReactNode } from 'react';
import gsap from 'gsap';
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from 'react-router';

import {
  getLocaleFromPath,
  LOCALES,
  LOCALE_HREFLANGS,
  localizePath,
  normalizePathname,
  SITE_URL,
  stripLocale,
} from '@shared/config';
import { localeDict } from '@shared/lib';
import { AppLink, Logo } from '@shared/ui';
import { Footer } from '@widgets/footer';
import { Header } from '@widgets/header';
import { CookieNotice } from '@widgets/cookie-notice';

import { LeadDialog } from '@widgets/lead-dialog';
import { Providers } from './providers';
import type { Route } from './+types/root';
import styles from './root.module.scss';

import './styles/global.scss';

// Content must become readable on schedule even on devices that drop frames.
// GSAP's default lag smoothing turns each >500ms stall into only 33ms of progress,
// stretching short entrances into many seconds. Keep wall-clock timing instead;
// reduced-motion handling and scroll-linked parallax remain in their own contexts.
if (typeof window !== 'undefined') gsap.ticker.lagSmoothing(0);

export function Layout({ children }: { children: ReactNode }) {
  const { pathname: rawPathname } = useLocation();
  const pathname = normalizePathname(rawPathname);
  const locale = getLocaleFromPath(pathname);
  const canonical = stripLocale(pathname);

  return (
    <html lang={LOCALE_HREFLANGS[locale]} suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <script
          dangerouslySetInnerHTML={{
            __html: `try{document.documentElement.dataset.theme=localStorage.getItem('designseichas-theme')==='light'?'light':'dark'}catch{document.documentElement.dataset.theme='dark'}`,
          }}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon-32.png?v=ds" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=ds" sizes="180x180" />
        <meta name="theme-color" content="#191c22" />
        <meta name="application-name" content="ДизайнСейчас" />
        <meta name="apple-mobile-web-app-title" content="ДизайнСейчас" />
        <meta property="og:site_name" content="ДизайнСейчас" />
        <link rel="canonical" href={SITE_URL + localizePath(canonical, locale)} />
        {LOCALES.map((alternateLocale) => (
          <link
            key={alternateLocale}
            rel="alternate"
            hrefLang={LOCALE_HREFLANGS[alternateLocale]}
            href={SITE_URL + localizePath(canonical, alternateLocale)}
          />
        ))}
        <link
          rel="alternate"
          hrefLang="x-default"
          href={SITE_URL + localizePath(canonical, 'ru')}
        />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <Providers>
      <LeadDialog />
      <Header />
      <main className={styles.main}>
        <Outlet />
      </main>
      <Footer />
      <CookieNotice />
    </Providers>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const { pathname } = useLocation();
  const t = localeDict(pathname);
  const is404 = isRouteErrorResponse(error) && error.status === 404;

  return (
    <main className={styles.errorPage}>
      <AppLink to="/" className={styles.errorBrand} aria-label={t.brand}>
        <Logo title={t.brand} style={{ height: '2.5rem' }} aria-hidden="true" />
        <span>{t.brand}</span>
      </AppLink>
      <p className={styles.errorCode} aria-hidden="true">
        {is404 ? '404' : '500'}
      </p>
      <h1 className={styles.errorTitle}>{is404 ? t.notFound.title : 'Error'}</h1>
      <p className={styles.errorText}>{is404 ? t.notFound.subtitle : 'Something went wrong.'}</p>
      <AppLink to="/" className={styles.errorBtn}>
        {t.notFound.back}
      </AppLink>
    </main>
  );
}
