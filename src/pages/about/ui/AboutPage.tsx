import { useTranslation } from 'react-i18next';

import { buildMeta, localeDict, type RouteMetaArgs } from '@shared/lib';
import { Container, PageHeader, Prose, Section } from '@shared/ui';
import { Achievements } from '@widgets/achievements';
import { ContactCta } from '@widgets/contact-cta';

export function meta({ location }: RouteMetaArgs) {
  const t = localeDict(location.pathname);
  return buildMeta(`${t.about.title} — ${t.brand}`, t.about.subtitle, location.pathname);
}

/** «О студии» — короткая история + полоса достижений (цифры/отзывы/команда) + финальный CTA.
 *  Собрана из переиспользуемых секций главной, чтобы страница ощущалась завершённой, а не пустой. */
export default function AboutPage() {
  const { t } = useTranslation();
  const story = t('about.story', { returnObjects: true }) as string[];

  return (
    <>
      <PageHeader title={t('about.title')} subtitle={t('about.subtitle')} />
      <Section compact>
        <Container>
          <Prose>
            {story.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </Prose>
        </Container>
      </Section>
      <Achievements />
      <ContactCta />
    </>
  );
}
