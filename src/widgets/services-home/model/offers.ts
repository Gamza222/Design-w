import type { Offer, OfferId } from './types';

/** 10 услуг блока «Наши услуги»: 4 крупных + 6 компактных. Тексты — в i18n
 *  `home.services.items.*` (ru+en зеркально), картинки — `config/images.ts` по слотам. */
export const OFFERS: Offer[] = [
  { id: 'planning', num: '01', size: 'lg', image: 'plan', gallery: ['plan', 'views3d'] },
  { id: 'collages', num: '02', size: 'lg', image: 'concept', gallery: ['plan', 'views3d', 'concept'] },
  {
    id: 'full',
    num: '03',
    size: 'lg',
    popular: true,
    image: 'viz',
    gallery: ['plan', 'concept', 'viz', 'drawings', 'materials', 'spec'],
  },
  { id: 'planViz', num: '04', size: 'lg', image: 'viz', gallery: ['plan', 'viz', 'materials', 'concept'] },
  { id: 'electric', num: '05', size: 'sm', image: 'drawings', gallery: ['plan', 'drawings', 'spec'] },
  { id: 'viz3d', num: '06', size: 'sm', image: 'viz', gallery: ['viz'] },
  { id: 'procurement', num: '07', size: 'sm', image: 'materials', gallery: ['materials', 'spec'] },
  { id: 'supervision', num: '08', size: 'sm', image: 'supervision', gallery: [], hasReceiveList: true },
  { id: 'ergonomics', num: '09', size: 'sm', image: 'plan', gallery: ['plan'], hasNote: true },
  { id: 'prelaunch', num: '10', size: 'sm', image: 'drawings', gallery: ['drawings'], hasNote: true },
];

/** Доп. услуги в модалке (блок «Дополнительно») — текущая услуга из списка исключается. */
export const ADDON_IDS: OfferId[] = ['supervision', 'ergonomics', 'prelaunch'];