import type { Service } from './types';

/** Studio services — static, bilingual data (rarely changes, no slugs needed). */
export const SERVICES: Service[] = [
  {
    id: 'turnkey',
    title: { ru: 'Дизайн под ключ', en: 'Turnkey design', be: 'Дызайн пад ключ' },
    description: {
      ru: 'Полный цикл: концепция, планировка, визуализация и реализация проекта.',
      en: 'Full cycle: concept, layout, visualisation and project delivery.',
      be: 'Поўны цыкл: канцэпцыя, планіроўка, візуалізацыя і рэалізацыя праекта.',
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
      ru: 'Прозрачная смета и ведомости материалов — без сюрпризов в бюджете.',
      en: 'A transparent estimate and material schedules — no budget surprises.',
      be: 'Празрысты каштарыс і ведамасці матэрыялаў без нечаканасцяў у бюджэце.',
    },
  },
  {
    id: 'supervision',
    title: { ru: 'Авторский надзор', en: 'Author supervision', be: 'Аўтарскі нагляд' },
    description: {
      ru: 'Контролируем стройку, чтобы результат точно совпал с проектом.',
      en: 'We oversee the build so the result matches the design exactly.',
      be: 'Кантралюем рамонт, каб вынік дакладна адпавядаў праекту.',
    },
  },
];
