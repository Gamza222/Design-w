import type { Package } from '@entities/package';

// Интерьерные фото тарифов (правая часть карточки — по макету 01). Временный сток в /images/temp;
// заменить на тематические снимки, не трогая разметку. position кадрирует видимую (правую) часть.
export const packageImages: Record<Package['id'], { src: string; position: string }> = {
  start: { src: '/images/temp/interior-1.jpg', position: '50% 50%' },
  comfort: { src: '/images/temp/interior-2.jpg', position: '50% 50%' },
  // У interior-4 в правой части кадра диагонали штор и здания за окном — на карточке
  // читались как «повёрнутое» фото с белыми клиньями. interior-6 даёт спокойные вертикали.
  full: { src: '/images/temp/interior-6.jpg', position: '65% 50%' },
};
