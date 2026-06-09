// Пакет дизайн-проекта. Тексты (название/цена/фичи) живут в i18n (home.packages.*),
// здесь — только структура: какие фичи входят, картинка и флаг популярного.
export interface Package {
  id: 'start' | 'comfort' | 'full';
  featureKeys: string[];
  image?: string;
  popular?: boolean;
}
