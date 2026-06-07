import { useTranslation } from 'react-i18next';

import { ROUTES } from '@shared/config';
import { AppLink, Container } from '@shared/ui';

import styles from './Footer.module.scss';

export function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  const links = [
    { to: ROUTES.services, label: t('nav.services') },
    { to: ROUTES.portfolio, label: t('nav.portfolio') },
    { to: ROUTES.blog, label: t('nav.blog') },
    { to: ROUTES.about, label: t('nav.about') },
    { to: ROUTES.contact, label: t('nav.contact') },
  ];

  return (
    <footer className={styles.footer}>
      <Container className={styles.inner}>
        <div className={styles.brandCol}>
          <span className={styles.brand}>{t('brand')}</span>
          <p className={styles.tagline}>{t('footer.tagline')}</p>
        </div>

        <nav className={styles.nav}>
          {links.map((link) => (
            <AppLink key={link.to} to={link.to} className={styles.link}>
              {link.label}
            </AppLink>
          ))}
        </nav>

        <p className={styles.copy}>
          © {year} {t('brand')}. {t('footer.rights')}
        </p>
      </Container>
    </footer>
  );
}
