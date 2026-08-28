// Нелокализуемые контактные данные студии (телефон, почта, адрес и соцсети).
// Часы работы — НЕ здесь: это переводимая строка, держим её в i18n (`header.hours`).

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
  email: string;
  emailHref: string;
  address: string | null;
  mapPoint: { longitude: number; latitude: number } | null;
  socials: readonly SocialLink[];
}

export interface LegalDetails {
  legalName: string | null;
  taxId: string | null;
  registrationId: string | null;
  legalAddress: string | null;
  bankName: string | null;
  bankAccountRub: string | null;
  bankAccountByn: string | null;
  bankId: string | null;
  correspondentAccount: string | null;
}

export const CONTACTS: Contacts = {
  phone: '+7 (915) 114-24-99',
  phoneHref: 'tel:+79151142499',
  email: 'dizain.seichas@yandex.ru',
  emailHref: 'mailto:dizain.seichas@yandex.ru',
  address: 'Москва, ул. Большой Каретный переулок д. 22, ст. 3',
  mapPoint: { longitude: 37.617105, latitude: 55.772132 },
  socials: [{ type: 'vk', label: 'VK', href: 'https://vk.ru/club240967161' }],
};

/** Реквизиты не подменяем демонстрационными данными. Юридические страницы рендерят
 *  только заполненные значения, а перед публикацией этот объект нужно заполнить данными владельца. */
export const LEGAL_DETAILS: LegalDetails = {
  legalName: null,
  taxId: null,
  registrationId: null,
  legalAddress: null,
  bankName: null,
  bankAccountRub: null,
  bankAccountByn: null,
  bankId: null,
  correspondentAccount: null,
};

export const ACCEPTED_CURRENCIES = ['RUB', 'BYN'] as const;
export const ACCEPTED_PAYMENT_METHODS = ['mir', 'belkart', 'bankTransfer'] as const;

export const DZEN_CHANNEL_URL = 'https://dzen.ru/disainseichas?share_to=link';
