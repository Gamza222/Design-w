import type { Package } from '@entities/package';

// Интерьерные фото тарифов (правая часть карточки — по макету 01). Временный сток в /images/temp;
// заменить на тематические снимки, не трогая разметку. position кадрирует видимую (правую) часть.
export const packageImages: Record<Package['id'], { src: string; position: string }> = {
  start: { src: '/images/temp/interior-1.jpg', position: '50% 50%' },
  comfort: { src: '/images/temp/interior-2.jpg', position: '50% 50%' },
  full: { src: '/images/temp/interior-4.jpg', position: '50% 50%' },
};
