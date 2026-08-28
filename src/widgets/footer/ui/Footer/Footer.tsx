import { useTranslation } from 'react-i18next';

import {
  CONTACTS,
  HOME_SECTIONS,
  ROUTES,
  homeSectionPath,
} from '@shared/config';
import { AppLink, Container, Logo, SocialLinks, YandexMap } from '@shared/ui';

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
  const sectionByRoute: Record<string, string> = {
    [ROUTES.services]: homeSectionPath(HOME_SECTIONS.services),
    [ROUTES.portfolio]: homeSectionPath(HOME_SECTIONS.portfolio),
    [ROUTES.blog]: homeSectionPath(HOME_SECTIONS.blog),
    [ROUTES.about]: homeSectionPath(HOME_SECTIONS.about),
    [ROUTES.contact]: homeSectionPath(HOME_SECTIONS.contacts),
  };
  const mapCoordinates = CONTACTS.mapPoint
    ? `${CONTACTS.mapPoint.longitude},${CONTACTS.mapPoint.latitude}`
    : null;
  const mapUrl = CONTACTS.address
    ? mapCoordinates
      ? `https://yandex.ru/maps/?ll=${encodeURIComponent(mapCoordinates)}&mode=whatshere&whatshere%5Bpoint%5D=${encodeURIComponent(mapCoordinates)}&z=17`
      : `https://yandex.ru/maps/?text=${encodeURIComponent(CONTACTS.address)}`
    : null;

  return (
    <footer id={HOME_SECTIONS.contacts} className={styles.footer} data-tone="dark">
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
                <AppLink to={sectionByRoute[link.to] ?? link.to} className={styles.link}>
                  {link.label}
                </AppLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.col}>
          <h2 className={styles.colTitle}>{t('footer.contactsTitle')}</h2>
          <ul className={styles.list}>
            {CONTACTS.phone != null && CONTACTS.phoneHref != null && (
              <li>
                <a href={CONTACTS.phoneHref} className={styles.link}>
                  {CONTACTS.phone}
                </a>
              </li>
            )}
            <li>
              <a href={CONTACTS.emailHref} className={styles.link}>
                {CONTACTS.email}
              </a>
            </li>
            {CONTACTS.address != null && <li className={styles.muted}>{CONTACTS.address}</li>}
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

        {CONTACTS.address && mapUrl && (
          <section className={styles.mapBlock} aria-labelledby="footer-map-title">
            <div className={styles.mapHead}>
              <h2 id="footer-map-title" className={styles.mapTitle}>
                {t('footer.mapTitle')}
              </h2>
              <a
                href={mapUrl}
                className={styles.mapLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t('footer.mapOpen')}
              </a>
            </div>
            <YandexMap
              address={CONTACTS.address}
              point={CONTACTS.mapPoint ?? undefined}
              title={t('footer.mapTitle')}
            />
          </section>
        )}

        <p className={styles.copy}>
          © {year} {t('brand')}. {t('footer.rights')}
        </p>
      </Container>
    </footer>
  );
}
