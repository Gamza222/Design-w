import type { ResultSlot } from '../model/types';

/** Реальные материалы студии: листы из примера проекта и авторские визуализации. */
export const resultImages: Record<ResultSlot, { src: string; position?: string }> = {
  plan: { src: '/realimages/web/project-plan.webp' },
  concept: { src: '/realimages/web/project-concept.webp' },
  viz: { src: '/realimages/web/project-minimal-loft-1.webp' },
  drawings: { src: '/realimages/web/project-lighting-plan.webp' },
  materials: { src: '/realimages/web/service-materials.webp' },
  spec: { src: '/realimages/web/project-electrics.webp' },
  views3d: { src: '/realimages/web/project-furniture-plan.webp' },
  supervision: { src: '/realimages/web/project-modern-kitchen-2.webp', position: '55% 50%' },
};
