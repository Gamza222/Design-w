import type { Service } from './types';

/** Studio services - static, bilingual data (rarely changes, no slugs needed). */
export const SERVICES: Service[] = [
  {
    id: 'design',
    title: { ru: 'Дизайн-проект', en: 'Design project', be: 'Дызайн-праект' },
    description: {
      ru: 'Состав дизайн-проекта зависит от выбранного пакета. Реализация оплачивается отдельно.',
      en: 'The design scope depends on the selected package. Implementation is paid separately.',
      be: 'Склад дызайн-праекта залежыць ад выбранага пакета. Рэалізацыя аплачваецца асобна.',
    },
  },
  {
    id: 'planning',
    title: { ru: 'Планировочные решения', en: 'Space planning', be: 'Планіровачныя рашэнні' },
    description: {
      ru: 'Эргономичные планировки, которые раскрывают потенциал каждого метра.',
      en: 'Ergonomic layouts that unlock the potential of every square metre.',
      be: 'Эрганамічныя планіроўкі, якія раскрываюць патэнцыял кожнага квадратнага метра.',
    },
  },
  {
    id: 'estimate',
    title: { ru: 'Смета и спецификации', en: 'Estimates & specs', be: 'Каштарыс і спецыфікацыі' },
    description: {
      ru: 'Прозрачная смета и ведомости материалов - без сюрпризов в бюджете.',
      en: 'A transparent estimate and material schedules - no budget surprises.',
      be: 'Празрысты каштарыс і ведамасці матэрыялаў без нечаканасцяў у бюджэце.',
    },
  },
  {
    id: 'supervision',
    title: { ru: 'Авторский надзор', en: 'Design supervision', be: 'Аўтарскі нагляд' },
    description: {
      ru: 'Отдельная услуга с ежемесячной оплатой; состав согласуем в договоре.',
      en: 'A separate monthly service; the scope is agreed in the contract.',
      be: 'Асобная паслуга са штомесячнай аплатай; склад узгоднім у дагаворы.',
    },
  },
];
