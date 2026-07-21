import type { ResultSlot } from '../model/types';

/** Изображения результатов по смысловым слотам (карточки услуг + галерея «Что вы получите»).
 *  ВРЕМЕННО подставлены интерьерные фото из public/images/temp — материалы «Планировочное
 *  решение», «Спецификация» и т.д. в репозитории отсутствуют. Чтобы подключить реальные,
 *  достаточно заменить src здесь (подписи берутся из i18n `home.services.slots.*`). */
export const resultImages: Record<ResultSlot, { src: string; position?: string }> = {
  plan: { src: '/images/temp/interior-3.jpg' },
  spec: { src: '/images/temp/interior-8.jpg' },
  materials: { src: '/images/temp/interior-6.jpg' },
  drawings: { src: '/images/temp/interior-7.jpg' },
  viz: { src: '/images/temp/interior-2.jpg' },
  concept: { src: '/images/temp/interior-1.jpg' },
  views3d: { src: '/images/temp/interior-5.jpg' },
  supervision: { src: '/images/temp/interior-4.jpg' },
};