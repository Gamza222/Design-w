import type { ResultSlot } from '../model/types';

/** Изображения результатов по смысловым слотам — материалы №1–№6 от клиента
 *  (`public/images/services/`, подписи берутся из i18n `home.services.slots.*`).
 *  Производные слоты: `views3d` — ч/б план с размерами (ТЗ: «изображение планировки или
 *  чёрно-белого объёмного вида»), `supervision` — интерьерный рендер. */
export const resultImages: Record<ResultSlot, { src: string; position?: string }> = {
  plan: { src: '/images/services/plan.jpg' },
  concept: { src: '/images/services/concept.jpg' },
  viz: { src: '/images/services/viz.jpg' },
  drawings: { src: '/images/services/drawings.jpg' },
  materials: { src: '/images/services/materials.jpg' },
  spec: { src: '/images/services/spec.jpg', position: '50% 12%' },
  views3d: { src: '/images/services/drawings.jpg' },
  supervision: { src: '/images/services/viz.jpg', position: '70% 50%' },
};