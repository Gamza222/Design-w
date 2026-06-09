import { packageImages } from '../config/images';
import type { Package } from './types';

// Пакеты дизайн-проекта — data-driven. Добавить/убрать пакет или фичу можно здесь;
// тексты подтянутся из i18n по id/ключу фичи (home.packages.*).
export const PACKAGES: Package[] = [
  {
    id: 'start',
    featureKeys: ['planning', 'collages', 'sketchPlans'],
    image: packageImages.start,
  },
  {
    id: 'comfort',
    featureKeys: ['planning', 'collages', 'viz3d', 'sketchPlans'],
    image: packageImages.comfort,
  },
  {
    id: 'full',
    featureKeys: ['planning', 'collages', 'viz3d', 'sketchPlans', 'materials'],
    image: packageImages.full,
    popular: true,
  },
];
