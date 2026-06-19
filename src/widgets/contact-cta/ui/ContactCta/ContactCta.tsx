import type { IconType } from 'react-icons';
import { FaTelegramPlane, FaVk, FaWhatsapp } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

import { ContactForm } from '@features/contact-form';
import { CONTACTS, type SocialType } from '@shared/config';
import { useScrollReveal } from '@shared/lib';
import { Container, GlassPanel, IconCheck, SectionHeader } from '@shared/ui';

import styles from './ContactCta.module.scss';

const SOCIAL_ICONS: Record<SocialType, IconType> = {
  telegram: FaTelegramPlane,
  vk: FaVk,
  whatsapp: FaWhatsapp,
};

/** Секция «Давайте обсудим ваш проект» (tone=dark, макет 10) — слева эмоция + чекмарки + кнопки
 *  мессенджеров, справа стеклянная карточка с формой-заявкой. Контент — i18n `home.contactCta`. */
export function ContactCta() {
  const { t } = useTranslation();
  const checks = t('home.contactCta.checks', { returnObjects: true }) as string[];

  // Появление по скроллу (общий хук).
  const root = useScrollReveal<HTMLElement>(
    [`.${styles.head}`, `.${styles.checks}`, `.${styles.socials}`, `.${styles.formCard}`],
    { start: 'top 80%', stagger: 0.1 },
  );

  return (
    <section className={styles.contact} data-tone="dark" ref={root}>
      <Container className={styles.inner}>
        <div className={styles.left}>
          <SectionHeader
            eyebrow={t('home.contactCta.eyebrow')}
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
        </div>

        <GlassPanel className={styles.formCard}>
          <ContactForm />
        </GlassPanel>
      </Container>
    </section>
  );
}
