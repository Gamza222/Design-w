// Нелокализуемые контактные данные студии (телефон, ссылки на соцсети).
// Часы работы — НЕ здесь: это переводимая строка, держим её в i18n (`header.hours`).
// Реальных данных пока нет, поэтому phone = null и socials пуст: все места рендера
// (хедер, футер, ContactCta) выводят эти элементы условно — достаточно заполнить
// значения ниже, и UI подхватит их автоматически.

export type SocialType = 'max' | 'vk';

export interface SocialLink {
  type: SocialType;
  label: string;
  href: string;
}

export interface Contacts {
  /** Телефон для отображения; null — телефон не показываем. */
  phone: string | null;
  /** `tel:`-ссылка; заполняется вместе с phone. */
  phoneHref: string | null;
  socials: readonly SocialLink[];
}

export const CONTACTS: Contacts = {
  phone: null, // напр. '+7 (800) 707-74-83'
  phoneHref: null, // напр. 'tel:+78007077483'
  socials: [
    // { type: 'max', label: 'MAX', href: 'https://max.ru/<профиль>' },
    // { type: 'vk', label: 'VK', href: 'https://vk.com/<профиль>' },
  ],
};
