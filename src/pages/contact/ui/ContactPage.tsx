import { useTranslation } from 'react-i18next';

import { EstimateForm } from '@features/estimate-form';
import { buildMeta, localeDict, type RouteMetaArgs } from '@shared/lib';
import { Container, PageHeader, Section } from '@shared/ui';

import styles from './ContactPage.module.scss';

export function meta({ location }: RouteMetaArgs) {
  const t = localeDict(location.pathname);
  return buildMeta(`${t.contact.title} — ${t.brand}`, t.contact.subtitle, location.pathname);
}

export default function ContactPage() {
  const { t } = useTranslation();
  const email = t('contact.email');
  const phone = t('contact.phone');

  const details = [
    { label: 'Email', value: email, href: `mailto:${email}` },
    { label: 'Phone', value: phone, href: `tel:${phone.replace(/[^+\d]/g, '')}` },
    { label: 'Address', value: t('contact.address') },
  ];

  return (
    <>
      <PageHeader title={t('contact.title')} subtitle={t('contact.subtitle')} />
      <Section>
        <Container className={styles.layout}>
          <ul className={styles.details}>
            {details.map((detail) => (
              <li key={detail.label} className={styles.detail}>
                <span className={styles.detailLabel}>{detail.label}</span>
                {detail.href ? (
                  <a href={detail.href} className={styles.detailValue}>
                    {detail.value}
                  </a>
                ) : (
                  <span className={styles.detailValue}>{detail.value}</span>
                )}
              </li>
            ))}
          </ul>
          <EstimateForm />
        </Container>
      </Section>
    </>
  );
}
