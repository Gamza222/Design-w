import type { Package } from '@entities/package';

// Интерьерные фото для карточек тарифов (фон карточки, как в макете tariff-example.jpg).
// Сейчас общий плейсхолдер hero-bg.jpg с разным кадрированием (position) на карточку — чтобы ряд
// не выглядел «одинаковым». Заменить на тематические снимки по тарифам, не трогая разметку.
const placeholder = '/images/hero-bg.jpg';

export const packageImages: Record<Package['id'], { src: string; position: string }> = {
  start: { src: placeholder, position: '78% 50%' },
  comfort: { src: placeholder, position: '50% 50%' },
  full: { src: placeholder, position: '24% 50%' },
};

// Фото для карточки-калькулятора (тёмная плита-действие — 4-я в ряду тарифов).
export const calcCardImage = placeholder;
