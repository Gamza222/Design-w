import type { Service } from './types';

/** Studio services — static, bilingual data (rarely changes, no slugs needed). */
export const SERVICES: Service[] = [
  {
    id: 'turnkey',
    title: { ru: 'Дизайн под ключ', en: 'Turnkey design' },
    description: {
      ru: 'Полный цикл: концепция, планировка, визуализация и реализация проекта.',
      en: 'Full cycle: concept, layout, visualisation and project delivery.',
    },
  },
  {
    id: 'planning',
    title: { ru: 'Планировочные решения', en: 'Space planning' },
    description: {
      ru: 'Эргономичные планировки, которые раскрывают потенциал каждого метра.',
      en: 'Ergonomic layouts that unlock the potential of every square metre.',
    },
  },
  {
    id: 'estimate',
    title: { ru: 'Смета и спецификации', en: 'Estimates & specs' },
    description: {
      ru: 'Прозрачная смета и ведомости материалов — без сюрпризов в бюджете.',
      en: 'A transparent estimate and material schedules — no budget surprises.',
    },
  },
  {
    id: 'supervision',
    title: { ru: 'Авторский надзор', en: 'Author supervision' },
    description: {
      ru: 'Контролируем стройку, чтобы результат точно совпал с проектом.',
      en: 'We oversee the build so the result matches the design exactly.',
    },
  },
];
