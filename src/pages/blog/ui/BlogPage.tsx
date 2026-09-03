import { useTranslation } from 'react-i18next';

import { getPosts } from '@entities/post';
import { buildMeta, localeDict, useLocale, type RouteMetaArgs } from '@shared/lib';
import { PageHeader, Section } from '@shared/ui';
import { BlogList } from '@widgets/blog-list';
import { ContactCta } from '@widgets/contact-cta';

export function meta({ location }: RouteMetaArgs) {
  const t = localeDict(location.pathname);
  return buildMeta(`${t.blog.title} | ${t.brand}`, t.blog.subtitle, location.pathname);
}

export default function BlogPage() {
  const { t } = useTranslation();
  const locale = useLocale();
  const posts = getPosts(locale);

  return (
    <>
      <PageHeader title={t('blog.title')} subtitle={t('blog.subtitle')} />
      <Section>
        <BlogList posts={posts} />
      </Section>

      {/* Страница не обрывается в футер — CTA-мост к заявке. */}
      <ContactCta />
    </>
  );
}
