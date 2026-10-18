import { getDict, type Locale } from '@shared/config';
import { formatMoney } from '@shared/lib';

import type { AddonId, MainPackageId, PackageId, TariffDefinition, TariffId } from './types';

const PLANNING = ['measuredPlan', 'twoLayouts', 'furniture', 'mono3d'] as const;
const DRAWINGS = [
  'demolition',
  'partitions',
  'finalPlan',
  'furniturePlan',
  'plumbing',
  'flooring',
  'underfloorHeating',
  'ceilings',
  'lighting',
  'switches',
  'sockets',
  'wallFinishes',
  'elevations',
] as const;

/** Confirmed scope and static commercial rates. All displays and estimates use this catalogue. */
export const TARIFFS: Record<TariffId, TariffDefinition> = {
  planning: {
    id: 'planning',
    kind: 'perM2',
    rates: { RUB: 1500, BYN: 55 },
    from: false,
    featureKeys: PLANNING,
    summaryKeys: ['twoLayouts', 'furniture', 'mono3d'],
    exclusionKeys: ['noDrawingsCollagesViz'],
    includedAddonIds: [],
  },
  drawings: {
    id: 'drawings',
    kind: 'perM2',
    rates: { RUB: 2000, BYN: 70 },
    from: false,
    featureKeys: [...PLANNING, ...DRAWINGS, 'approximateSpec'],
    summaryKeys: ['planningScope', 'workingDrawings', 'approximateSpec'],
    exclusionKeys: ['noCollagesViz'],
    includedAddonIds: [],
  },
  collages: {
    id: 'collages',
    kind: 'perM2',
    rates: { RUB: 2500, BYN: 90 },
    from: false,
    featureKeys: [...PLANNING, ...DRAWINGS, 'collages', 'detailedSpec'],
    summaryKeys: ['planningScope', 'workingDrawings', 'collages', 'detailedSpec'],
    exclusionKeys: ['noViz'],
    includedAddonIds: [],
  },
  planViz: {
    id: 'planViz',
    kind: 'perM2',
    rates: { RUB: 3000, BYN: 110 },
    from: false,
    featureKeys: [...PLANNING, 'roomVisualizations'],
    summaryKeys: ['planningScope', 'mono3d', 'roomVisualizations'],
    exclusionKeys: ['noDrawingsCollages'],
    includedAddonIds: ['viz3d'],
  },
  full: {
    id: 'full',
    kind: 'perM2',
    rates: { RUB: 3900, BYN: 140 },
    from: false,
    featureKeys: [...PLANNING, 'collages', 'mainRoomVisualizations', ...DRAWINGS, 'specifications'],
    summaryKeys: [
      'planningScope',
      'collages',
      'mainRoomVisualizations',
      'workingDrawings',
      'specifications',
    ],
    exclusionKeys: ['separateDelivery'],
    includedAddonIds: ['viz3d'],
  },
  electric: {
    id: 'electric',
    kind: 'perM2',
    rates: { RUB: 3000, BYN: 110 },
    from: true,
    featureKeys: [],
    summaryKeys: [],
    exclusionKeys: ['scopeToAgree'],
    includedAddonIds: [],
  },
  viz3d: {
    id: 'viz3d',
    kind: 'perM2',
    rates: { RUB: 1000, BYN: 35 },
    from: true,
    featureKeys: ['visualizations'],
    summaryKeys: ['visualizations'],
    exclusionKeys: ['visualizationScope'],
    includedAddonIds: [],
  },
  supervision: {
    id: 'supervision',
    kind: 'monthly',
    rates: { RUB: 30000, BYN: 1100 },
    from: true,
    featureKeys: [],
    summaryKeys: [],
    exclusionKeys: ['supervisionScope'],
    includedAddonIds: [],
  },
  procurement: {
    id: 'procurement',
    kind: 'quoted',
    rates: null,
    from: false,
    featureKeys: [],
    summaryKeys: [],
    exclusionKeys: ['procurementScope'],
    includedAddonIds: [],
  },
  consultation: {
    id: 'consultation',
    kind: 'quoted',
    rates: null,
    from: false,
    featureKeys: [],
    summaryKeys: [],
    exclusionKeys: ['consultationScope'],
    includedAddonIds: [],
  },
};

export const MAIN_PACKAGE_IDS: readonly MainPackageId[] = [
  'planning',
  'drawings',
  'collages',
  'planViz',
  'full',
];
export const PROJECT_PACKAGE_IDS: readonly PackageId[] = [...MAIN_PACKAGE_IDS, 'electric'];
export const ADDON_IDS: readonly AddonId[] = [
  'viz3d',
  'supervision',
  'procurement',
  'consultation',
];
export const TARIFF_IDS: readonly TariffId[] = [...PROJECT_PACKAGE_IDS, ...ADDON_IDS];

export const BYN_PRICE_REFERENCE = {
  date: '2026-10-05',
  rubScale: 100,
  officialRate: 3.6125,
  source: 'https://api.nbrb.by/exrates/rates/RUB?parammode=2&ondate=2026-10-05',
  rounding: 'perM2: nearest 5 BYN; monthly: nearest 100 BYN',
} as const;

export const SERVICE_LANDING_TARIFFS = {
  planirovka: 'planning',
  viz3d: 'viz3d',
  sketch: 'full',
} as const satisfies Record<string, TariffId>;

export function getTariff(id: TariffId, locale: Locale) {
  const definition = TARIFFS[id];
  const dict = getDict(locale).tariffs;
  const currency: 'RUB' | 'BYN' = locale === 'be' ? 'BYN' : 'RUB';
  const rate = definition.rates?.[currency] ?? null;
  const featureText = dict.features as Record<string, string>;
  const exclusionText = dict.exclusions as Record<string, string>;
  const priceLabel =
    rate === null
      ? dict.onRequest
      : `${definition.from ? `${dict.from} ` : ''}${formatMoney(rate, locale)}${definition.kind === 'monthly' ? dict.perMonth : dict.perM2}`;

  return {
    ...definition,
    ...dict.items[id],
    currency,
    rate,
    priceLabel,
    includes: definition.featureKeys.map((key) => featureText[key]),
    summary: definition.summaryKeys.map((key) => featureText[key]),
    exclusions: definition.exclusionKeys.map((key) => exclusionText[key]),
  };
}
