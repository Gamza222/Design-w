import type { ResultSlot } from '../model/types';

/** Реальные материалы студии: листы из примера проекта и авторские визуализации. */
export const resultImages: Record<ResultSlot, { src: string; position?: string }> = {
  plan: { src: '/realimages/web/project-plan.jpg' },
  concept: { src: '/realimages/web/project-concept.jpg' },
  viz: { src: '/realimages/web/project-minimal-loft-1.jpg' },
  drawings: { src: '/realimages/web/project-lighting-plan.jpg' },
  materials: { src: '/realimages/web/service-materials.jpg' },
  spec: { src: '/realimages/web/project-electrics.jpg' },
  views3d: { src: '/realimages/web/project-furniture-plan.jpg' },
  supervision: { src: '/realimages/web/project-modern-kitchen-2.jpg', position: '55% 50%' },
};
