import type { Offer, OfferId } from './types';

const STANDARD_ADDONS = [
  'viz3d',
  'supervision',
  'procurement',
  'consultation',
] as const satisfies readonly OfferId[];
const VISUALIZED_ADDONS = STANDARD_ADDONS.filter((id) => id !== 'viz3d');

/** Galleries show only deliverables confirmed in the shared tariff catalogue. */
export const OFFERS: Offer[] = [
  { id: 'planning', num: '01', gallery: ['plan', 'furniturePlan'], addons: STANDARD_ADDONS },
  {
    id: 'drawings',
    num: '02',
    gallery: ['plan', 'drawings', 'electrics'],
    addons: STANDARD_ADDONS,
  },
  {
    id: 'collages',
    num: '03',
    gallery: ['plan', 'drawings', 'electrics'],
    addons: STANDARD_ADDONS,
  },
  {
    id: 'planViz',
    num: '04',
    gallery: ['plan', 'furniturePlan', 'viz'],
    addons: VISUALIZED_ADDONS,
  },
  {
    id: 'full',
    num: '05',
    popular: true,
    gallery: ['plan', 'concept', 'viz', 'drawings', 'electrics'],
    addons: VISUALIZED_ADDONS,
  },
  { id: 'electric', num: '06', gallery: [] },
  { id: 'viz3d', num: '07', gallery: ['viz'] },
  { id: 'supervision', num: '08', gallery: [] },
  { id: 'procurement', num: '09', gallery: [] },
  { id: 'consultation', num: '10', gallery: [] },
];
