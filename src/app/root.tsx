import type { ReactNode } from 'react';
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

import { Preloader } from './preloader/Preloader';
import { Providers } from './providers';
import type { Route } from './+types/root';
import styles from './root.module.scss';

import './styles/global.scss';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname: rawPathname } = useLocation();
  const pathname = normalizePathname(rawPathname);
  const locale = getLocaleFromPath(pathname);
  const canonical = stripLocale(pathname);

  return (
    <html lang={LOCALE_HREFLANGS[locale]}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="canonical" href={SITE_URL + pathname} />
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
      <Preloader />
      <Header />
      <main className={styles.main}>
        <Outlet />
      </main>
      <Footer />
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
        <Logo title={t.brand} style={{ height: '2.5rem' }} />
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
