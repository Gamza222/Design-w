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
  phone: null, // напр. '+7 (800) 707-74-83'
  phoneHref: null, // напр. 'tel:+78007077483'
  socials: [
    // { type: 'max', label: 'MAX', href: 'https://max.ru/<профиль>' },
    // { type: 'vk', label: 'VK', href: 'https://vk.com/<профиль>' },
  ],
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
