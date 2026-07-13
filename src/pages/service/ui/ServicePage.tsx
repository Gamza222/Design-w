import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';

import { getProjects } from '@entities/project';
import {
  ROUTES,
  SERVICE_LANDINGS,
  stripLocale,
  type ServiceLandingKey,
} from '@shared/config';
import { buildMeta, localeDict, useLocale, useScrollReveal, type RouteMetaArgs } from '@shared/lib';
import {
  Accordion,
  Breadcrumbs,
  Button,
  Container,
  IconCheck,
  PageHeader,
  Section,
  SectionHeader,
} from '@shared/ui';
import { ContactCta } from '@widgets/contact-cta';
import { Projects } from '@widgets/projects';

import styles from './ServicePage.module.scss';

interface FaqItem {
  q: string;
  a: string;
}

/** Один модуль обслуживает три литеральных SEO-роута — услуга определяется по pathname. */
function landingKey(pathname: string): ServiceLandingKey {
  const path = stripLocale(pathname);
  const keys = Object.keys(SERVICE_LANDINGS) as ServiceLandingKey[];
  return keys.find((key) => SERVICE_LANDINGS[key] === path) ?? 'planirovka';
}

export function meta({ location }: RouteMetaArgs) {
  const t = localeDict(location.pathname);
  const page = t.servicePages[landingKey(location.pathname)];
  return buildMeta(`${page.h1} — ${t.brand}`, page.subtitle, location.pathname);
}

/** SEO-посадка услуги (ТЗ, Фаза 1): H1 + интро, «что входит», цена/срок + CTA,
 *  FAQ (тёмная секция), кейсы (лента портфолио) и финальный блок заявки. */
export default function ServicePage() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const locale = useLocale();

  const key = landingKey(pathname);
  const base = `servicePages.${key}`;
  const includes = t(`${base}.includes`, { returnObjects: true }) as string[];
  const faq = t(`${base}.faq`, { returnObjects: true }) as FaqItem[];
  const [open, setOpen] = useState(0);
  const projects = getProjects(locale).slice(0, 6);

  // Появление интро-колонки и карточки условий по скроллу (общий хук).
  const root = useScrollReveal<HTMLDivElement>([`.${styles.main} > *`, `.${styles.card}`], {
    start: 'top 85%',
    stagger: 0.1,
  });

  return (
    <>
      <Container className={styles.crumbs}>
        <Breadcrumbs
          aria-label={t('nav.breadcrumbs')}
          items={[
            { label: t('nav.home'), to: ROUTES.home },
            { label: t('nav.services'), to: ROUTES.services },
            { label: t(`${base}.h1`) },
          ]}
        />
      </Container>

      <PageHeader title={t(`${base}.h1`)} subtitle={t(`${base}.subtitle`)} />

      <Section compact>
        <Container ref={root} className={styles.layout}>
          <div className={styles.main}>
            <p className={styles.intro}>{t(`${base}.intro`)}</p>

            <h2 className={styles.includesTitle}>{t(`${base}.includesTitle`)}</h2>
            <ul className={styles.includes}>
              {includes.map((item) => (
                <li key={item} className={styles.include}>
                  <span className={styles.includeIcon} aria-hidden="true">
                    <IconCheck />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <aside className={styles.card}>
            <div className={styles.cardRow}>
              <span className={styles.cardLabel}>{t(`${base}.priceLabel`)}</span>
              <span className={styles.cardValue}>{t(`${base}.price`)}</span>
            </div>
            <div className={styles.cardRow}>
              <span className={styles.cardLabel}>{t(`${base}.termLabel`)}</span>
              <span className={styles.cardValue}>{t(`${base}.term`)}</span>
            </div>
            <Button to={ROUTES.contact} size="lg" className={styles.cardCta}>
              {t(`${base}.cta`)}
            </Button>
          </aside>
        </Container>
      </Section>

      <Section compact tone="dark" className={styles.faqSection}>
        <Container>
          <SectionHeader title={t(`${base}.faqTitle`)} align="center" className={styles.faqHead} />
          <div className={styles.faqList}>
            {faq.map((item, index) => (
              <Accordion
                key={item.q}
                id={`service-faq-${index}`}
                summary={item.q}
                open={open === index}
                onToggle={() => setOpen(open === index ? -1 : index)}
              >
                <p className={styles.faqAnswer}>{item.a}</p>
              </Accordion>
            ))}
          </div>
        </Container>
      </Section>

      <Projects projects={projects} />
      <ContactCta />
    </>
  );
}
