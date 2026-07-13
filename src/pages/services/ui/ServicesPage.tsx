import { useTranslation } from 'react-i18next';

import { SERVICE_LANDINGS, type ServiceLandingKey } from '@shared/config';
import { buildMeta, localeDict, useScrollReveal, type RouteMetaArgs } from '@shared/lib';
import {
  AppLink,
  Container,
  IconArrowRight,
  PageHeader,
  Section,
  SectionHeader,
} from '@shared/ui';
import { ContactCta } from '@widgets/contact-cta';
import { Process } from '@widgets/process';
import { ServicesList } from '@widgets/services-list';

import styles from './ServicesPage.module.scss';

export function meta({ location }: RouteMetaArgs) {
  const t = localeDict(location.pathname);
  return buildMeta(`${t.services.title} — ${t.brand}`, t.services.subtitle, location.pathname);
}

const LANDING_KEYS = Object.keys(SERVICE_LANDINGS) as ServiceLandingKey[];

/** «Услуги» — список направлений + хаб SEO-посадок (планировка / 3D / эскизный проект) +
 *  этапы работы + финальный CTA. Секции переиспользованы с главной, чтобы страница была
 *  насыщенной и вела к заявке, а не обрывалась на четырёх карточках. */
export default function ServicesPage() {
  const { t } = useTranslation();

  // Появление карточек-посадок по скроллу (общий хук).
  const landingsRoot = useScrollReveal<HTMLDivElement>(
    [`.${styles.landingsHead}`, `.${styles.landings} > *`],
    { start: 'top 85%', stagger: 0.1 },
  );

  return (
    <>
      <PageHeader title={t('services.title')} subtitle={t('services.subtitle')} />
      <Section compact>
        <ServicesList />
      </Section>
      <Section compact>
        <Container ref={landingsRoot}>
          <SectionHeader
            title={t('services.landingsTitle')}
            subtitle={t('services.landingsSubtitle')}
            className={styles.landingsHead}
          />
          <div className={styles.landings}>
            {LANDING_KEYS.map((key) => (
              <AppLink key={key} to={SERVICE_LANDINGS[key]} className={styles.landingCard}>
                <h3 className={styles.landingTitle}>{t(`servicePages.${key}.h1`)}</h3>
                <p className={styles.landingText}>{t(`servicePages.${key}.subtitle`)}</p>
                <span className={styles.landingMeta}>
                  {t(`servicePages.${key}.price`)} · {t(`servicePages.${key}.term`)}
                </span>
                <span className={styles.landingCta}>
                  <span>{t('services.landingsCta')}</span>
                  <IconArrowRight aria-hidden="true" />
                </span>
              </AppLink>
            ))}
          </div>
        </Container>
      </Section>
      <Process />
      <ContactCta />
    </>
  );
}
