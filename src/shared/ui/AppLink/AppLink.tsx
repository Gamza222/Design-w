import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, type LinkProps } from 'react-router';

import { DEFAULT_LOCALE, isLocale, localizePath } from '../../config';

interface AppLinkProps extends Omit<LinkProps, 'to'> {
  /** Canonical (locale-agnostic) path — the current locale prefix is added automatically. */
  to: string;
  children: ReactNode;
}

/** Locale-aware wrapper around React Router's Link. */
export function AppLink({ to, children, ...rest }: AppLinkProps) {
  const { i18n } = useTranslation();
  const locale = isLocale(i18n.language) ? i18n.language : DEFAULT_LOCALE;

  return (
    <Link to={localizePath(to, locale)} {...rest}>
      {children}
    </Link>
  );
}
