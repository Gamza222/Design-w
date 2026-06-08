// Нелокализуемые контактные данные студии (телефон, ссылки на соцсети).
// Часы работы — НЕ здесь: это переводимая строка, держим её в i18n (`header.hours`).
// Плейсхолдеры — заменить на реальные значения.

export type SocialType = 'telegram' | 'vk' | 'whatsapp';

export interface SocialLink {
  type: SocialType;
  label: string;
  href: string;
}

export interface Contacts {
  phone: string;
  phoneHref: string;
  socials: readonly SocialLink[];
}

export const CONTACTS: Contacts = {
  phone: '+7 (700) 000-00-00',
  phoneHref: 'tel:+77000000000',
  socials: [
    { type: 'telegram', label: 'Telegram', href: 'https://t.me/placeholder' },
    { type: 'vk', label: 'VK', href: 'https://vk.com/placeholder' },
    { type: 'whatsapp', label: 'WhatsApp', href: 'https://wa.me/77000000000' },
  ],
} as const;
