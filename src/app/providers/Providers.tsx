import { useEffect, type ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';
import { useLocation } from 'react-router';

import { getI18n, getLocaleFromPath } from '@shared/config';

/**
 * Global providers. Derives the locale from the URL and feeds an i18next instance
 * (fresh per render on the server, singleton on the client) down the tree.
 */
export function Providers({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const locale = getLocaleFromPath(pathname);
  const i18n = getI18n(locale);

  // Keep the client singleton's language in sync with the URL on navigation.
  useEffect(() => {
    if (i18n.language !== locale) {
      void i18n.changeLanguage(locale);
    }
  }, [i18n, locale]);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
