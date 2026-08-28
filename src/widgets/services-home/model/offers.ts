import type { Offer, OfferId } from './types';

const STANDARD_ADDONS = [
  'supervision',
  'ergonomics',
  'prelaunch',
] as const satisfies readonly OfferId[];

/** 10 услуг блока «Наши услуги» в порядке ленты. Тексты — в i18n
 *  `home.services.items.*` (ru+en зеркально), картинки галерей — `config/images.ts` по слотам. */
export const OFFERS: Offer[] = [
  { id: 'planning', num: '01', gallery: ['plan', 'views3d'], addons: STANDARD_ADDONS },
  {
    id: 'collages',
    num: '02',
    gallery: ['plan', 'views3d', 'concept'],
    addons: STANDARD_ADDONS,
  },
  {
    id: 'full',
    num: '03',
    popular: true,
    gallery: ['plan', 'concept', 'viz', 'drawings', 'materials', 'spec'],
    addons: STANDARD_ADDONS,
  },
  {
    id: 'planViz',
    num: '04',
    gallery: ['plan', 'viz', 'materials', 'concept'],
    addons: STANDARD_ADDONS,
  },
  {
    id: 'electric',
    num: '05',
    gallery: ['plan', 'drawings', 'spec'],
    addons: STANDARD_ADDONS,
  },
  { id: 'viz3d', num: '06', gallery: ['viz'], addons: STANDARD_ADDONS },
  {
    id: 'procurement',
    num: '07',
    gallery: ['materials', 'spec'],
    addons: STANDARD_ADDONS,
  },
  {
    id: 'supervision',
    num: '08',
    gallery: [],
    addons: ['procurement', 'ergonomics', 'prelaunch'],
    hasReceiveList: true,
  },
  { id: 'ergonomics', num: '09', gallery: ['plan'], hasNote: true },
  { id: 'prelaunch', num: '10', gallery: ['drawings'], hasNote: true },
];
