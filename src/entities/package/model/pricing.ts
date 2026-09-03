// Правила цен калькулятора — ЕДИНЫЙ числовой источник (один путь — одно место).
// Тексты (названия форматов/услуг, «от X ₽/м²») живут в i18n `home.calculator.*` и идут
// по ТОМУ ЖЕ порядку, что массивы ниже (сопоставление по индексу). Меняя цену здесь —
// синхронизируйте строку в i18n.

export interface CalcFormat {
  id: string;
  /** Базовая ставка формата, ₽/м². */
  ratePerM2: number;
  /** Services already included in the base rate and never charged twice. */
  includedAddonIds: readonly string[];
}

export interface CalcAddon {
  id: string;
  /** perM2 is area-based, flat is fixed, quoted is confirmed after consultation. */
  kind: 'perM2' | 'flat' | 'quoted';
  amount: number;
}

/** Formats and rates confirmed in the service brief supplied by the client. */
export const CALC_FORMATS: CalcFormat[] = [
  { id: 'planning', ratePerM2: 1500, includedAddonIds: [] },
  { id: 'collages', ratePerM2: 2000, includedAddonIds: [] },
  { id: 'viz', ratePerM2: 3000, includedAddonIds: ['viz3d'] },
  { id: 'full', ratePerM2: 3900, includedAddonIds: ['viz3d'] },
];

/** Доп. услуги — порядок == i18n `home.calculator.addons`. */
export const CALC_ADDONS: CalcAddon[] = [
  { id: 'viz3d', kind: 'perM2', amount: 1000 },
  { id: 'supervision', kind: 'flat', amount: 30000 },
  { id: 'complectation', kind: 'quoted', amount: 0 },
  { id: 'electric', kind: 'perM2', amount: 1500 },
  { id: 'ergonomics', kind: 'flat', amount: 20000 },
  { id: 'prelaunch', kind: 'flat', amount: 20000 },
];

/** Отдельный подтверждённый прайс для белорусской витрины. Это фиксированные
 *  коммерческие ставки в BYN, а не динамическая конвертация на клиенте. */
export const CALC_FORMATS_BYN: CalcFormat[] = [
  { id: 'planning', ratePerM2: 55, includedAddonIds: [] },
  { id: 'collages', ratePerM2: 70, includedAddonIds: [] },
  { id: 'viz', ratePerM2: 110, includedAddonIds: ['viz3d'] },
  { id: 'full', ratePerM2: 140, includedAddonIds: ['viz3d'] },
];

export const CALC_ADDONS_BYN: CalcAddon[] = [
  { id: 'viz3d', kind: 'perM2', amount: 35 },
  { id: 'supervision', kind: 'flat', amount: 1080 },
  { id: 'complectation', kind: 'quoted', amount: 0 },
  { id: 'electric', kind: 'perM2', amount: 55 },
  { id: 'ergonomics', kind: 'flat', amount: 720 },
  { id: 'prelaunch', kind: 'flat', amount: 720 },
];

/** Границы площади (м²) для степпера. */
export const CALC_AREA = { min: 20, max: 400, step: 1, default: 72 } as const;

/** Итоговая стоимость: (ставка формата + perM2-надбавки) × площадь + разовые суммы. */
export function calcTotal(format: CalcFormat, addons: readonly CalcAddon[], area: number): number {
  const chargeable = addons.filter((addon) => !format.includedAddonIds.includes(addon.id));
  const perM2 = chargeable
    .filter((a) => a.kind === 'perM2')
    .reduce((sum, a) => sum + a.amount, format.ratePerM2);
  const flat = chargeable
    .filter((a) => a.kind === 'flat')
    .reduce((sum, a) => sum + a.amount, 0);
  return perM2 * area + flat;
}
