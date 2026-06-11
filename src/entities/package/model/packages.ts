import type { Package } from './types';

// Пакеты дизайн-проекта — data-driven. Добавить/убрать пакет или фичу можно здесь;
// тексты подтянутся из i18n по id/ключу фичи (home.packages.*).
export const PACKAGES: Package[] = [
  {
    id: 'start',
    featureKeys: ['planning', 'collages', 'sketchPlans'],
  },
  {
    id: 'comfort',
    featureKeys: ['planning', 'collages', 'viz3d', 'sketchPlans'],
  },
  {
    id: 'full',
    featureKeys: ['planning', 'collages', 'viz3d', 'sketchPlans', 'materials'],
    popular: true,
  },
];
