import { buildMeta, localeDict, type RouteMetaArgs } from '@shared/lib';
import { ContactCta } from '@widgets/contact-cta';

export function meta({ location }: RouteMetaArgs) {
  const t = localeDict(location.pathname);
  return buildMeta(`${t.contact.title} — ${t.brand}`, t.contact.subtitle, location.pathname);
}

/** Страница «Контакты» переиспользует блок «Давайте обсудим ваш проект» (реальная форма-заявка,
 *  тёмная тональность). Отдельная форма-заглушка (features/estimate-form) удалена как незавершённая. */
export default function ContactPage() {
  return <ContactCta />;
}
