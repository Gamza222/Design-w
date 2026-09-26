import { useTranslation } from 'react-i18next';

import { buildMeta, localeDict, type RouteMetaArgs } from '@shared/lib';
import { Container, PageHeader, Prose, Section } from '@shared/ui';
import { Achievements } from '@widgets/achievements';
import { ContactCta } from '@widgets/contact-cta';

import styles from './AboutPage.module.scss';

export function meta({ location }: RouteMetaArgs) {
  const t = localeDict(location.pathname);
  return buildMeta(`${t.about.title} | ${t.brand}`, t.about.subtitle, location.pathname);
}

/** «О студии» — короткая история + полоса достижений (цифры/отзывы/команда) + финальный CTA.
 *  Собрана из переиспользуемых секций главной, чтобы страница ощущалась завершённой, а не пустой. */
export default function AboutPage() {
  const { t } = useTranslation();
  const story = t('about.story', { returnObjects: true }) as string[];

  return (
    <>
      <PageHeader title={t('about.title')} subtitle={t('about.subtitle')} />
      <Section compact className={styles.storySection}>
        <Container className={styles.storyGrid}>
          <Prose className={styles.storyCopy}>
            {story.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </Prose>
          <figure className={styles.mediaFrame} aria-label={t('about.title')}>
            <video
              className={styles.media}
              controls
              muted
              playsInline
              preload="none"
              poster="/realimages/web/about-poster.webp"
            >
              <source src="/realimages/web/about-studio.mp4" type="video/mp4" />
            </video>
          </figure>
        </Container>
      </Section>
      <Achievements />
      <ContactCta />
    </>
  );
}
