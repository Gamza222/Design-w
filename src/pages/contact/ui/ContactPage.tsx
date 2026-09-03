import { useTranslation } from 'react-i18next';

import { buildMeta, localeDict, type RouteMetaArgs } from '@shared/lib';
import { PageHeader } from '@shared/ui';
import { ContactCta } from '@widgets/contact-cta';

export function meta({ location }: RouteMetaArgs) {
  const t = localeDict(location.pathname);
  return buildMeta(`${t.contact.title} | ${t.brand}`, t.contact.subtitle, location.pathname);
}

/** Страница «Контакты»: стандартный hero внутренних страниц (H1 + сабтайтл) + блок
 *  «Давайте обсудим ваш проект» с реальной формой-заявкой; `details` добавляет в левую
 *  колонку прямые контакты (почта, часы работы, география) — рядом с формой. */
export default function ContactPage() {
  const { t } = useTranslation();

  return (
    <>
      <PageHeader title={t('contact.title')} subtitle={t('contact.subtitle')} />
      <ContactCta details />
    </>
  );
}
