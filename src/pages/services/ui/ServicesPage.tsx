import { useTranslation } from 'react-i18next';

import { buildMeta, localeDict, type RouteMetaArgs } from '@shared/lib';
import { PageHeader, Section } from '@shared/ui';
import { ServicesList } from '@widgets/services-list';

export function meta({ location }: RouteMetaArgs) {
  const t = localeDict(location.pathname);
  return buildMeta(`${t.services.title} — ${t.brand}`, t.services.subtitle, location.pathname);
}

export default function ServicesPage() {
  const { t } = useTranslation();

  return (
    <>
      <PageHeader title={t('services.title')} subtitle={t('services.subtitle')} />
      <Section>
        <ServicesList />
      </Section>
    </>
  );
}
