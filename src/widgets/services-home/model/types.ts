/** Смысловые слоты изображений результата — подписи в i18n `home.services.slots.*`,
 *  файлы в `config/images.ts`. Один слот переиспользуется в карточках и галереях модалки. */
export type ResultSlot =
  | 'plan' // Планировочное решение (№1)
  | 'spec' // Спецификация (№2)
  | 'materials' // Подбор материалов и мебели (№3)
  | 'drawings' // Схемы и чертежи (№4)
  | 'viz' // 3D-визуализации (№5)
  | 'concept' // Концепция интерьера (№6)
  | 'views3d' // 3D-виды в чёрно-белом формате
  | 'supervision'; // интерьерное фото для «Авторского надзора»

export type OfferId =
  | 'planning'
  | 'collages'
  | 'full'
  | 'planViz'
  | 'electric'
  | 'viz3d'
  | 'procurement'
  | 'supervision'
  | 'ergonomics'
  | 'prelaunch';

/** Структура услуги; все тексты — в i18n `home.services.items.<id>.*`. */
export interface Offer {
  id: OfferId;
  /** Порядковый номер «01…10» на карточке и в модалке. */
  num: string;
  /** Крупная карточка первого ряда или компактная второго. */
  size: 'lg' | 'sm';
  /** Выделенная тёмная карточка с плашкой «Популярный». */
  popular?: boolean;
  /** Слот изображения карточки. */
  image: ResultSlot;
  /** Галерея «Что вы получите» в модалке (слоты по порядку). */
  gallery: ResultSlot[];
  /** Вместо галереи — текстовый список результатов (i18n `receive[]`, авторский надзор). */
  hasReceiveList?: boolean;
  /** У услуги есть примечание о консультационном характере (i18n `note`). */
  hasNote?: boolean;
}