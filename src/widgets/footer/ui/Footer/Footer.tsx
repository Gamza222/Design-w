import { useTranslation } from 'react-i18next';

import { CONTACTS, ROUTES } from '@shared/config';
import { AppLink, Container, Logo, SocialLinks } from '@shared/ui';

import styles from './Footer.module.scss';

interface FooterLink {
  label: string;
  to: string;
}

/** Подвал сайта (tone=dark, макет 10): бренд + слоган + соцсети, навигация, контакты, документы;
 *  снизу — копирайт. Контент — i18n `footer.*`, контакты — `@shared/config` CONTACTS. */
export function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();
  const nav = t('footer.nav', { returnObjects: true }) as FooterLink[];
  const documents = t('footer.documents', { returnObjects: true }) as FooterLink[];

  return (
    <footer className={styles.footer} data-tone="dark">
      <Container className={styles.inner}>
        <div className={styles.brandCol}>
          <AppLink to={ROUTES.home} className={styles.logoLink} aria-label={t('brand')}>
            <Logo title={t('brand')} className={styles.logo} />
            <span className={styles.brand}>{t('brand')}</span>
          </AppLink>
          <p className={styles.tagline}>{t('footer.tagline')}</p>
          <SocialLinks items={CONTACTS.socials} className={styles.socials} />
        </div>

        <nav className={styles.col} aria-label={t('footer.navTitle')}>
          <h2 className={styles.colTitle}>{t('footer.navTitle')}</h2>
          <ul className={styles.list}>
            {nav.map((link) => (
              <li key={link.to}>
                <AppLink to={link.to} className={styles.link}>
                  {link.label}
                </AppLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.col}>
          <h2 className={styles.colTitle}>{t('footer.contactsTitle')}</h2>
          <ul className={styles.list}>
            <li>
              <a href={CONTACTS.phoneHref} className={styles.link}>
                {CONTACTS.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${t('contact.email')}`} className={styles.link}>
                {t('contact.email')}
              </a>
            </li>
            <li className={styles.muted}>{t('header.hours')}</li>
          </ul>
        </div>

        <nav className={styles.col} aria-label={t('footer.documentsTitle')}>
          <h2 className={styles.colTitle}>{t('footer.documentsTitle')}</h2>
          <ul className={styles.list}>
            {documents.map((link) => (
              <li key={link.to}>
                <AppLink to={link.to} className={styles.link}>
                  {link.label}
                </AppLink>
              </li>
            ))}
          </ul>
        </nav>

        <p className={styles.copy}>
          © {year} {t('brand')}. {t('footer.rights')}
        </p>
      </Container>
    </footer>
  );
}
