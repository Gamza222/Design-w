// Правила цен калькулятора — ЕДИНЫЙ числовой источник (один путь — одно место).
// Тексты (названия форматов/услуг, «от X ₽/м²») живут в i18n `home.calculator.*` и идут
// по ТОМУ ЖЕ порядку, что массивы ниже (сопоставление по индексу). Меняя цену здесь —
// синхронизируйте строку в i18n.

export interface CalcFormat {
  id: string;
  /** Базовая ставка формата, ₽/м². */
  ratePerM2: number;
}

export interface CalcAddon {
  id: string;
  /** perM2 — прибавка к ставке ₽/м² (умножается на площадь); flat — разовая сумма ₽. */
  kind: 'perM2' | 'flat';
  amount: number;
}

/** Форматы проекта — порядок == i18n `home.calculator.formats`. */
export const CALC_FORMATS: CalcFormat[] = [
  { id: 'planning', ratePerM2: 2500 },
  { id: 'collages', ratePerM2: 3900 },
  { id: 'viz', ratePerM2: 5000 },
  { id: 'full', ratePerM2: 5000 },
];

/** Доп. услуги — порядок == i18n `home.calculator.addons`. */
export const CALC_ADDONS: CalcAddon[] = [
  { id: 'viz3d', kind: 'perM2', amount: 1000 },
  { id: 'supervision', kind: 'flat', amount: 20000 },
  { id: 'complectation', kind: 'flat', amount: 10000 },
  { id: 'electric', kind: 'perM2', amount: 300 },
  { id: 'ergonomics', kind: 'flat', amount: 20000 },
  { id: 'visit', kind: 'flat', amount: 5000 },
];

/** Границы площади (м²) для степпера. */
export const CALC_AREA = { min: 20, max: 400, step: 1, default: 72 } as const;

/** Итоговая стоимость: (ставка формата + perM2-надбавки) × площадь + разовые суммы. */
export function calcTotal(
  format: CalcFormat,
  addons: readonly CalcAddon[],
  area: number,
): number {
  const perM2 = addons
    .filter((a) => a.kind === 'perM2')
    .reduce((sum, a) => sum + a.amount, format.ratePerM2);
  const flat = addons.filter((a) => a.kind === 'flat').reduce((sum, a) => sum + a.amount, 0);
  return perM2 * area + flat;
}
