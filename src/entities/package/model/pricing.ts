import type { Locale } from '@shared/config';

import { ADDON_IDS, getTariff, PROJECT_PACKAGE_IDS, TARIFFS } from './tariffs';
import type { AddonId, PackageId } from './types';

export interface CalcFormat {
  id: PackageId;
  ratePerM2: number;
  from: boolean;
  includedAddonIds: readonly AddonId[];
}

export interface CalcAddon {
  id: AddonId;
  kind: 'perM2' | 'monthly' | 'quoted';
  amount: number;
  from: boolean;
}

function formats(currency: 'RUB' | 'BYN'): CalcFormat[] {
  return PROJECT_PACKAGE_IDS.map((id) => ({
    id,
    ratePerM2: TARIFFS[id].rates![currency],
    from: TARIFFS[id].from,
    includedAddonIds: TARIFFS[id].includedAddonIds,
  }));
}

function addons(currency: 'RUB' | 'BYN'): CalcAddon[] {
  return ADDON_IDS.map((id) => ({
    id,
    kind: TARIFFS[id].kind,
    amount: TARIFFS[id].rates?.[currency] ?? 0,
    from: TARIFFS[id].from,
  }));
}

export const CALC_FORMATS = formats('RUB');
export const CALC_FORMATS_BYN = formats('BYN');
export const CALC_ADDONS = addons('RUB');
export const CALC_ADDONS_BYN = addons('BYN');
export const CALC_AREA = { min: 20, max: 400, step: 1, default: 72 } as const;

/** Monthly and quoted services are retained in the enquiry, outside the project subtotal. */
export function calcTotal(
  format: CalcFormat,
  selected: readonly CalcAddon[],
  area: number,
): number {
  const seen = new Set<string>(format.includedAddonIds);
  let rate = format.ratePerM2;
  for (const addon of selected) {
    if (seen.has(addon.id)) continue;
    seen.add(addon.id);
    if (addon.kind === 'perM2') rate += addon.amount;
  }
  return rate * area;
}

export function isFromEstimate(format: CalcFormat, selected: readonly CalcAddon[]): boolean {
  return (
    format.from ||
    selected.some(
      (addon) =>
        addon.kind === 'perM2' && addon.from && !format.includedAddonIds.includes(addon.id),
    )
  );
}

/** The same localized names and rates are sent to the lead form and backend. */
export function getCalculationContext(
  packageId: PackageId,
  addonIds: readonly AddonId[],
  area: number,
  locale: Locale,
) {
  const format = (locale === 'be' ? CALC_FORMATS_BYN : CALC_FORMATS).find(
    (item) => item.id === packageId,
  )!;
  const selected = (locale === 'be' ? CALC_ADDONS_BYN : CALC_ADDONS).filter(
    (item) => addonIds.includes(item.id) && !format.includedAddonIds.includes(item.id),
  );
  const tariff = getTariff(packageId, locale);
  return {
    source: 'calculator',
    service: tariff.name,
    packageId,
    packageName: tariff.name,
    area,
    extras: selected.map((addon) => {
      const item = getTariff(addon.id, locale);
      return `${item.name} — ${item.priceLabel}`;
    }),
    estimate: calcTotal(format, selected, area),
    currency: tariff.currency,
    preliminary: true,
  };
}
