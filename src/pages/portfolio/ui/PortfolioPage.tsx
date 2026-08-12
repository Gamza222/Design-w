import { useTranslation } from 'react-i18next';

import { getProjects } from '@entities/project';
import { buildMeta, localeDict, useLocale, type RouteMetaArgs } from '@shared/lib';
import { PageHeader, Section } from '@shared/ui';
import { PortfolioGrid } from '@widgets/portfolio-grid';
import { ContactCta } from '@widgets/contact-cta';

export function meta({ location }: RouteMetaArgs) {
  const t = localeDict(location.pathname);
  return buildMeta(`${t.portfolio.title} — ${t.brand}`, t.portfolio.subtitle, location.pathname);
}

export default function PortfolioPage() {
  const { t } = useTranslation();
  const locale = useLocale();
  const projects = getProjects(locale);

  return (
    <>
      <PageHeader title={t('portfolio.title')} subtitle={t('portfolio.subtitle')} />
      <Section>
        <PortfolioGrid projects={projects} />
      </Section>

      {/* Страница не обрывается в футер — CTA-мост к заявке. */}
      <ContactCta />
    </>
  );
}
