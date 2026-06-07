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

import { getLocaleFromPath, localizePath, SITE_URL, stripLocale } from '@shared/config';
import { localeDict } from '@shared/lib';
import { AppLink } from '@shared/ui';
import { Footer } from '@widgets/footer';
import { Header } from '@widgets/header';

import { Preloader } from './preloader/Preloader';
import { Providers } from './providers';
import { SmoothScroll } from './smooth-scroll/SmoothScroll';
import type { Route } from './+types/root';
import styles from './root.module.scss';

import './styles/global.scss';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const locale = getLocaleFromPath(pathname);
  const canonical = stripLocale(pathname);

  return (
    <html lang={locale}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="canonical" href={SITE_URL + pathname} />
        <link rel="alternate" hrefLang="ru" href={SITE_URL + localizePath(canonical, 'ru')} />
        <link rel="alternate" hrefLang="en" href={SITE_URL + localizePath(canonical, 'en')} />
        <link
          rel="alternate"
          hrefLang="x-default"
          href={SITE_URL + localizePath(canonical, 'ru')}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
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
      <SmoothScroll>
        <main className={styles.main}>
          <Outlet />
        </main>
        <Footer />
      </SmoothScroll>
    </Providers>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const { pathname } = useLocation();
  const t = localeDict(pathname);
  const is404 = isRouteErrorResponse(error) && error.status === 404;

  return (
    <main className={styles.errorPage}>
      <h1>{is404 ? t.notFound.title : 'Error'}</h1>
      <p>{is404 ? t.notFound.subtitle : 'Something went wrong.'}</p>
      <AppLink to="/">{t.notFound.back}</AppLink>
    </main>
  );
}
