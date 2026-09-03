import { useTranslation } from 'react-i18next';

import { buildMeta, localeDict, type RouteMetaArgs } from '@shared/lib';
import { Container, PageHeader, Prose, Section } from '@shared/ui';

export function meta({ location }: RouteMetaArgs) {
  const t = localeDict(location.pathname);
  return buildMeta(`${t.achievements.title} | ${t.brand}`, t.achievements.subtitle, location.pathname);
}

export default function AchievementsPage() {
  const { t } = useTranslation();

  return (
    <>
      <PageHeader title={t('achievements.title')} subtitle={t('achievements.subtitle')} />
      <Section>
        <Container>
          <Prose>
            <p>{t('achievements.subtitle')}</p>
          </Prose>
        </Container>
      </Section>
    </>
  );
}
