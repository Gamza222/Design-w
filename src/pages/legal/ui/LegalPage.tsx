import { useLocation } from 'react-router';

import { getLocaleFromPath, LEGAL_DETAILS, ROUTES, stripLocale } from '@shared/config';
import { buildMeta, useLocale, type RouteMetaArgs } from '@shared/lib';
import { AppLink, Container, PageHeader, Prose, Section } from '@shared/ui';

import { LEGAL_DETAIL_LABELS, LEGAL_DOCUMENTS, LEGAL_ROUTE_IDS } from '../model/documents';
import styles from './LegalPage.module.scss';

export function meta({ location }: RouteMetaArgs) {
  const locale = getLocaleFromPath(location.pathname);
  const id = LEGAL_ROUTE_IDS[stripLocale(location.pathname)] ?? 'offer';
  const document = LEGAL_DOCUMENTS[locale][id];
  return buildMeta(`${document.title} | TheDesignNow`, document.description, location.pathname);
}

export default function LegalPage() {
  const locale = useLocale();
  const { pathname } = useLocation();
  const id = LEGAL_ROUTE_IDS[stripLocale(pathname)] ?? 'offer';
  const document = LEGAL_DOCUMENTS[locale][id];
  const details = Object.entries(LEGAL_DETAILS).filter(
    (entry): entry is [string, string] => entry[1] != null,
  );

  return (
    <>
      <PageHeader title={document.title} subtitle={document.description} />
      <Section compact>
        <Container className={styles.inner}>
          <p className={styles.updated}>{document.updated}</p>
          <Prose className={styles.prose}>
            {document.sections.map((section) => (
              <section key={section.title}>
                <h2>{section.title}</h2>
                {section.paragraphs?.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.items && (
                  <ul>
                    {section.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}

            {id === 'requisites' && details.length > 0 && (
              <dl className={styles.details}>
                {details.map(([key, value]) => (
                  <div key={key}>
                    <dt>{LEGAL_DETAIL_LABELS[locale][key as keyof typeof LEGAL_DETAILS]}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            )}

            {id === 'offer' && (
              <p className={styles.related}>
                <AppLink to={ROUTES.privacy}>{LEGAL_DOCUMENTS[locale].privacy.title}</AppLink>
                <AppLink to={ROUTES.requisites}>{LEGAL_DOCUMENTS[locale].requisites.title}</AppLink>
              </p>
            )}
          </Prose>
        </Container>
      </Section>
    </>
  );
}
