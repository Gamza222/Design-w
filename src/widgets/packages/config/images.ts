import type { Package } from '@entities/package';

// Оптимизированные фото реальных проектов студии.
export const packageImages: Record<Package['id'], { src: string; position: string }> = {
  start: { src: '/realimages/web/tariff-start.jpg', position: '50% 50%' },
  comfort: { src: '/realimages/web/tariff-comfort.jpg', position: '50% 50%' },
  full: { src: '/realimages/web/tariff-full.jpg', position: '56% 50%' },
};
