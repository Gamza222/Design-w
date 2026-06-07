import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { LocaleSwitcher } from '@features/locale-switcher';
import { ROUTES } from '@shared/config';
import { cn } from '@shared/lib';
import { AppLink, Container } from '@shared/ui';

import styles from './Header.module.scss';

export function Header() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  const links = [
    { to: ROUTES.services, label: t('nav.services') },
    { to: ROUTES.portfolio, label: t('nav.portfolio') },
    { to: ROUTES.blog, label: t('nav.blog') },
    { to: ROUTES.about, label: t('nav.about') },
    { to: ROUTES.contact, label: t('nav.contact') },
  ];

  return (
    <header className={styles.header}>
      <Container className={styles.inner}>
        <AppLink to={ROUTES.home} className={styles.brand} onClick={close}>
          {t('brand')}
        </AppLink>

        <nav className={cn(styles.nav, open && styles.navOpen)}>
          {links.map((link) => (
            <AppLink key={link.to} to={link.to} className={styles.link} onClick={close}>
              {link.label}
            </AppLink>
          ))}
        </nav>

        <div className={styles.actions}>
          <LocaleSwitcher />
          <button
            type="button"
            className={styles.burger}
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            <span className={cn(styles.burgerLine, open && styles.burgerLineOpen)} />
          </button>
        </div>
      </Container>
    </header>
  );
}
