import type { ComponentType, SVGProps } from 'react';
import { FaVk } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

import { ContactForm } from '@features/contact-form';
import { CONTACTS, HOME_SECTIONS, type SocialType } from '@shared/config';
import { cn, useScrollReveal } from '@shared/lib';
import {
  Container,
  GlassPanel,
  IconCheck,
  IconClock,
  IconGlobe,
  IconMail,
  IconMapPin,
  IconMaxMessenger,
  IconPhone,
  IconWallet,
  SectionHeader,
} from '@shared/ui';

import styles from './ContactCta.module.scss';

const SOCIAL_ICONS: Record<SocialType, ComponentType<SVGProps<SVGSVGElement>>> = {
  max: IconMaxMessenger,
  vk: FaVk,
};

interface ContactCtaProps {
  /** Блок прямых контактов (почта, часы, география) в левой колонке — для страницы «Контакты». */
  details?: boolean;
}

/** Секция «Давайте обсудим ваш проект» (tone=dark, макет 10) — слева эмоция + чекмарки + кнопки
 *  мессенджеров (пока соцсети не заполнены в конфиге — скрыты), справа стеклянная карточка
 *  с формой-заявкой. Контент — i18n `home.contactCta`, прямые контакты — `contact.*`. */
export function ContactCta({ details = false }: ContactCtaProps) {
  const { t } = useTranslation();
  const checks = t('home.contactCta.checks', { returnObjects: true }) as string[];
  const hasSocials = CONTACTS.socials.length > 0;

  // Появление по скроллу (общий хук); список целей — только реально отрендеренные блоки.
  const root = useScrollReveal<HTMLElement>(
    [
      `.${styles.head}`,
      `.${styles.checks}`,
      ...(hasSocials ? [`.${styles.socials}`] : []),
      ...(details ? [`.${styles.details}`] : []),
      `.${styles.formCard}`,
    ],
    { start: 'top 80%', stagger: 0.1 },
  );

  return (
    <section
      id={HOME_SECTIONS.request}
      className={styles.contact}
      data-tone="dark"
      ref={root}
    >
      <Container className={styles.inner}>
        <div className={styles.left}>
          {/* На странице «Контакты» (details) H1 уже «Контакты» — золотой оверлайн
              с тем же словом прямо под ним был бы дублем, прячем его. */}
          <SectionHeader
            eyebrow={details ? undefined : t('home.contactCta.eyebrow')}
            title={t('home.contactCta.title')}
            subtitle={t('home.contactCta.subtitle')}
            className={styles.head}
          />

          <ul className={styles.checks}>
            {checks.map((check) => (
              <li key={check} className={styles.check}>
                <span className={styles.checkIcon} aria-hidden="true">
                  <IconCheck />
                </span>
                <span>{check}</span>
              </li>
            ))}
          </ul>

          {hasSocials && (
            <div className={styles.socials}>
              <p className={styles.socialsTitle}>{t('home.contactCta.socialsTitle')}</p>
              <ul className={styles.socialList}>
                {CONTACTS.socials.map(({ type, label, href }) => {
                  const Icon = SOCIAL_ICONS[type];
                  return (
                    <li key={type}>
                      <a
                        className={styles.socialBtn}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-type={type}
                      >
                        <Icon className={styles.socialIcon} aria-hidden="true" />
                        <span>{label}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {details && (
            <div className={styles.details}>
              <p className={styles.detailsTitle}>{t('contact.details.title')}</p>
              <ul className={styles.detailsList}>
                <li className={styles.detailsItem}>
                  <span className={styles.detailsIcon} aria-hidden="true">
                    <IconMail />
                  </span>
                  <div>
                    <p className={styles.detailsLabel}>{t('contact.details.emailLabel')}</p>
                    <a
                      className={cn(styles.detailsValue, styles.detailsLink)}
                      href={CONTACTS.emailHref}
                    >
                      {CONTACTS.email}
                    </a>
                  </div>
                </li>
                {CONTACTS.phone != null && CONTACTS.phoneHref != null && (
                  <li className={styles.detailsItem}>
                    <span className={styles.detailsIcon} aria-hidden="true">
                      <IconPhone />
                    </span>
                    <div>
                      <p className={styles.detailsLabel}>{t('contact.details.phoneLabel')}</p>
                      <a
                        className={cn(styles.detailsValue, styles.detailsLink)}
                        href={CONTACTS.phoneHref}
                      >
                        {CONTACTS.phone}
                      </a>
                    </div>
                  </li>
                )}
                {CONTACTS.address != null && (
                  <li className={styles.detailsItem}>
                    <span className={styles.detailsIcon} aria-hidden="true">
                      <IconMapPin />
                    </span>
                    <div>
                      <p className={styles.detailsLabel}>{t('contact.details.addressLabel')}</p>
                      <p className={styles.detailsValue}>{CONTACTS.address}</p>
                    </div>
                  </li>
                )}
                <li className={styles.detailsItem}>
                  <span className={styles.detailsIcon} aria-hidden="true">
                    <IconWallet />
                  </span>
                  <div>
                    <p className={styles.detailsLabel}>{t('contact.details.paymentLabel')}</p>
                    <p className={styles.detailsValue}>{t('contact.details.paymentValue')}</p>
                  </div>
                </li>
                <li className={styles.detailsItem}>
                  <span className={styles.detailsIcon} aria-hidden="true">
                    <IconClock />
                  </span>
                  <div>
                    <p className={styles.detailsLabel}>{t('contact.details.hoursLabel')}</p>
                    <p className={styles.detailsValue}>{t('header.hours')}</p>
                  </div>
                </li>
                <li className={styles.detailsItem}>
                  <span className={styles.detailsIcon} aria-hidden="true">
                    <IconGlobe />
                  </span>
                  <div>
                    <p className={styles.detailsLabel}>{t('contact.details.geoLabel')}</p>
                    <p className={styles.detailsValue}>{t('contact.details.geoValue')}</p>
                  </div>
                </li>
              </ul>
            </div>
          )}
        </div>

        <GlassPanel className={styles.formCard}>
          <ContactForm />
        </GlassPanel>
      </Container>
    </section>
  );
}
