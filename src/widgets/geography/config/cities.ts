// Города на карте РФ (макет 06). Координаты x/y — в системе viewBox карты (см. russia-map.ts:
// "0 198 1024 628"), т.е. x ∈ [0..1024], y ∈ [198..826]. Подобраны под силуэт; уточняются визуально.
// hub — узел, из которого расходятся маршруты (Москва). anchorEnd — подпись слева от точки
// (для городов у правого края, чтобы текст не уезжал за карту).
// Отображаемые имена — в i18n: `home.geography.cities.<id>` (ru + en).

export interface City {
  id: string;
  x: number;
  y: number;
  hub?: boolean;
  anchorEnd?: boolean;
}

export const CITIES: City[] = [
  { id: 'spb', x: 150, y: 380 },
  { id: 'moscow', x: 168, y: 446, hub: true, anchorEnd: true },
  { id: 'krasnodar', x: 140, y: 560, anchorEnd: true },
  { id: 'sochi', x: 150, y: 590, anchorEnd: true },
  { id: 'kazan', x: 250, y: 452 },
  { id: 'ekb', x: 332, y: 432 },
  // anchorEnd: вправо подпись уходила под плавающую карточку кейса (≥lg).
  { id: 'nsk', x: 470, y: 506, anchorEnd: true },
  { id: 'irkutsk', x: 600, y: 520 },
  { id: 'vlk', x: 862, y: 602, anchorEnd: true },
];
