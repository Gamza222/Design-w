import type { Locale } from '../../config/locales';

const MONTHS: Record<Locale, readonly string[]> = {
  ru: [
    'января',
    'февраля',
    'марта',
    'апреля',
    'мая',
    'июня',
    'июля',
    'августа',
    'сентября',
    'октября',
    'ноября',
    'декабря',
  ],
  en: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  be: [
    'студзеня',
    'лютага',
    'сакавіка',
    'красавіка',
    'мая',
    'чэрвеня',
    'ліпеня',
    'жніўня',
    'верасня',
    'кастрычніка',
    'лістапада',
    'снежня',
  ],
};

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})(?:$|T)/;

/** Format a date identically during prerendering and hydration in every supported locale. */
export function formatDate(iso: string, locale: Locale): string {
  const match = ISO_DATE.exec(iso);
  if (!match) return iso;

  const [, year, rawMonth, rawDay] = match;
  const monthIndex = Number(rawMonth) - 1;
  const day = Number(rawDay);
  const month = MONTHS[locale][monthIndex];

  if (!year || !month || day < 1 || day > 31) return iso;

  return locale === 'en' ? `${month} ${day}, ${year}` : `${day} ${month} ${year} г.`;
}
