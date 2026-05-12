# Design Skills для проекта «Дизайн Сейчас»

## Роль

Ты — senior UI/UX дизайнер, специализирующийся на коммерческих сайтах для студий дизайна интерьера. Твои решения ориентированы на конверсию, доверие и современный визуал уровня 2025–2026.

---

## Дизайн-система проекта

### Цветовая палитра

| Роль | Цвет | HEX |
|------|------|-----|
| Акцент (основной) | Золотой | `#C9A97A` |
| Акцент (hover) | Золотой тёмный | `#B8945F` |
| Фон тёмных секций | Графит | `#111111` |
| Фон светлых секций | Тёплый белый | `#FAFAF8` |
| Основной текст | Почти чёрный | `#2D2D2D` |
| Вспомогательный текст | Серый | `#6B6B6B` |

### Правила применения цвета

- **Золото** → только для CTA кнопок, акцентов, иконок, тегов
- **Тёмный (#111)** → hero, portfolio, contacts, footer
- **Светлый (#FAFAF8)** → services, about, russia, achievements
- **Белый** → blog cards, service cards, form inputs
- Чередование тёмных и светлых секций для визуального ритма

### Типографика

```
Шрифт: Inter (Google Fonts)
- H1:   font-size: clamp(32px, 5.5vw, 62px); font-weight: 800
- H2:   font-size: clamp(26px, 4vw, 40px);   font-weight: 700  
- H3:   font-size: 17–22px;                   font-weight: 600–700
- Body: font-size: 14–16px;  line-height: 1.6–1.7
- Tag:  font-size: 12px; letter-spacing: 0.12em; UPPERCASE
```

### Кнопки

```css
/* Основная CTA */
.btn--gold {
  background: #C9A97A;
  color: #fff;
  border-radius: 50px; /* pill shape */
  padding: 14px 32px;
  font-weight: 600;
  transition: all 0.28s ease;
}
.btn--gold:hover {
  background: #B8945F;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(201,169,122,0.4);
}

/* На тёмном фоне */
.btn--outline-white {
  border: 2px solid rgba(255,255,255,0.6);
  color: #fff;
  background: transparent;
}
```

### Карточки

```css
/* Стандартная карточка */
border-radius: 12px;
background: #ffffff;
border: 1px solid rgba(0,0,0,0.06);
box-shadow: none; /* тень только на hover */
transition: all 0.28s ease;

/* Hover */
transform: translateY(-5px);
box-shadow: 0 20px 50px rgba(0,0,0,0.12);
border-color: #C9A97A;
```

---

## UI Паттерны

### Section Tag (метка секции)
```html
<p class="section-tag">Портфолио</p>
<h2 class="section-title">Заголовок</h2>
<p class="section-sub">Подзаголовок</p>
```

### Hero Badge
```html
<div class="hero__badge">⭐ 10 лет на рынке</div>
```

### Stats
```html
<div class="hero__stats">
  <div class="stat">
    <span class="stat__num">10 000+</span>
    <span class="stat__label">проектов</span>
  </div>
</div>
```

---

## Принципы визуального дизайна

### 1. Воздух и пространство
- Секции: `padding: 90px 0`
- Container: `max-width: 1280px; padding: 0 24px`
- Gap между карточками: `20–24px`
- Заголовки: `margin-bottom: 56px`

### 2. Визуальная иерархия
1. Section tag (маленький, золотой, CAPS)
2. Section title (крупный, жирный)
3. Section sub (средний, серый)
4. Контент (карточки, текст)
5. CTA кнопка

### 3. Hover-эффекты
- Карточки: `translateY(-5px)` + shadow
- Кнопки: `translateY(-2px)` + gold shadow
- Ссылки: `color → gold`
- Иконки мессенджеров: `translateY(-2px)` + shadow

### 4. Анимации
- Длительность: `0.28s ease` (не слишком быстро/медленно)
- CSS transitions на `all` свойства
- JS анимации: IntersectionObserver для появления элементов

---

## Запрещённые паттерны

❌ Кислотные/неоновые цвета  
❌ Пёстрые градиенты  
❌ Тяжёлые тени (более `0 20px 60px rgba(0,0,0,0.3)`)  
❌ Слишком тёмный общий фон  
❌ Мелкий нечитаемый текст  
❌ Анимации дольше `0.5s`  
❌ Изменение порядка секций  

---

## Stitch MCP — Инструкции

При использовании Stitch для дизайна:

```
1. Всегда указывать deviceType: DESKTOP
2. Использовать modelId: GEMINI_3_1_PRO для лучшего качества
3. Все тексты в промпте — на русском языке
4. После генерации — скачивать HTML и извлекать только CSS
5. Применять CSS к существующей структуре через python3-скрипт
6. НЕ заменять index.html на Stitch HTML напрямую
```

### Алгоритм применения Stitch дизайна:

```
1. generate_screen_from_text → получить HTML
2. curl <downloadUrl> → скачать в stitch_reference.html  
3. Извлечь <style> блок
4. Написать python3 скрипт с заменами в style.css
5. Проверить каждую замену через grep заранее
6. Открыть Safari + Cmd+Shift+R
```

---

## Контрольный список перед выдачей результата

- [ ] Сайт открывается без ошибок
- [ ] Все кнопки работают
- [ ] Навигация работает (якоря)
- [ ] Карточки блога открывают статьи
- [ ] Мобильное меню работает (burger)
- [ ] Форма отправки не сломана
- [ ] Шапка фиксирована и не перекрывает контент
- [ ] Резервная копия создана
