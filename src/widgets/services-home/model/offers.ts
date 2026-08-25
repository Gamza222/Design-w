import type { Offer, OfferId } from './types';

/** 10 услуг блока «Наши услуги» в порядке ленты. Тексты — в i18n
 *  `home.services.items.*` (ru+en зеркально), картинки галерей — `config/images.ts` по слотам. */
export const OFFERS: Offer[] = [
  { id: 'planning', num: '01', gallery: ['plan', 'views3d'] },
  { id: 'collages', num: '02', gallery: ['plan', 'views3d', 'concept'] },
  {
    id: 'full',
    num: '03',
    popular: true,
    gallery: ['plan', 'concept', 'viz', 'drawings', 'materials', 'spec'],
  },
  { id: 'planViz', num: '04', gallery: ['plan', 'viz', 'materials', 'concept'] },
  { id: 'electric', num: '05', gallery: ['plan', 'drawings', 'spec'] },
  { id: 'viz3d', num: '06', gallery: ['viz'] },
  { id: 'procurement', num: '07', gallery: ['materials', 'spec'] },
  { id: 'supervision', num: '08', gallery: [], hasReceiveList: true },
  { id: 'ergonomics', num: '09', gallery: ['plan'], hasNote: true },
  { id: 'prelaunch', num: '10', gallery: ['drawings'], hasNote: true },
];

/** Доп. услуги в модалке (блок «Дополнительно») — текущая услуга из списка исключается. */
export const ADDON_IDS: OfferId[] = ['supervision', 'ergonomics', 'prelaunch'];
