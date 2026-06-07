import { useTranslation } from 'react-i18next';

import { buildMeta, localeDict, type RouteMetaArgs } from '@shared/lib';
import { Container, PageHeader, Prose, Section } from '@shared/ui';

export function meta({ location }: RouteMetaArgs) {
  const t = localeDict(location.pathname);
  return buildMeta(`${t.about.title} — ${t.brand}`, t.about.subtitle, location.pathname);
}

export default function AboutPage() {
  const { t } = useTranslation();
  const story = t('about.story', { returnObjects: true }) as string[];

  return (
    <>
      <PageHeader title={t('about.title')} subtitle={t('about.subtitle')} />
      <Section>
        <Container>
          <Prose>
            {story.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </Prose>
        </Container>
      </Section>
    </>
  );
}
