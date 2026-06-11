// Пакет дизайн-проекта. Тексты (название/цена/фичи) живут в i18n (home.packages.*),
// здесь — только структура: какие фичи входят и флаг популярного тарифа.
export interface Package {
  id: 'start' | 'comfort' | 'full';
  featureKeys: string[];
  popular?: boolean;
}
