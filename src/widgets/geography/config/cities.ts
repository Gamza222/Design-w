// Города на карте РФ (макет 06). Координаты x/y — в системе viewBox карты (см. russia-map.ts:
// "0 198 1024 628"), т.е. x ∈ [0..1024], y ∈ [198..826]. Подобраны под силуэт; уточняются визуально.
// hub — узел, из которого расходятся маршруты (Москва). anchorEnd — подпись слева от точки
// (для городов у правого края, чтобы текст не уезжал за карту).

export interface City {
  name: string;
  x: number;
  y: number;
  hub?: boolean;
  anchorEnd?: boolean;
}

export const CITIES: City[] = [
  { name: 'Санкт-Петербург', x: 150, y: 380 },
  { name: 'Москва', x: 168, y: 446, hub: true, anchorEnd: true },
  { name: 'Краснодар', x: 140, y: 560, anchorEnd: true },
  { name: 'Сочи', x: 150, y: 590, anchorEnd: true },
  { name: 'Казань', x: 250, y: 452 },
  { name: 'Екатеринбург', x: 332, y: 432 },
  { name: 'Новосибирск', x: 470, y: 506 },
  { name: 'Иркутск', x: 600, y: 520 },
  { name: 'Владивосток', x: 862, y: 602, anchorEnd: true },
];
