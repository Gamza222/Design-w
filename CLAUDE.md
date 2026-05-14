# CLAUDE.md — Технический контекст проекта «Дизайн Сейчас»

> Автоматически читается Claude при каждом обращении к проекту.

---

## 📁 ФАЙЛОВАЯ СТРУКТУРА

```
дизайн нау/
├── index.html          # Главная страница
├── blog.html           # Страница блога
├── article.html        # Страница статьи (читает хэш #1, #2, #3...)
├── portfolio.html      # Портфолио-аккордеон
├── style.css           # Главный CSS (~400 строк, новый дизайн 2026-05)
├── script.js           # Весь JS (табы, слайдер, формы, EmailJS)
├── style_backup.css    # Резервная копия CSS (старый стиль)
├── style_backup2.css   # Резервная копия CSS (до редизайна мая 2026)
├── index_backup.html   # Резервная копия HTML
├── index_backup2.html  # Резервная копия HTML (до редизайна мая 2026)
├── CLAUDE.md           # Этот файл
├── РУКОВОДСТВО.md      # Руководство пользователя
├── ДИЗАЙН-АУДИТ.md    # Аудит дизайна
├── .claude/
│   ├── settings.json
│   └── design-skills.md
│
├── hero-bg.jpg         # Фото для hero секции
├── russia-map.png      # Карта России
├── gramota1.jpg        # Грамота 2024
├── gramota2.jpg        # Грамота 2022
├── review1-17.jpg      # Фото отзывов (17 штук)
└── лого для сайта дизайн сейчас.png  # Логотип PNG
```

### ⚠️ ОТСУТСТВУЮЩИЕ ФАЙЛЫ
```
blog1.jpg  ← НЕ СУЩЕСТВУЕТ → блог показывает пустые карточки
blog2.jpg  ← НЕ СУЩЕСТВУЕТ
blog3.jpg  ← НЕ СУЩЕСТВУЕТ
```

---

## 🗺️ КАРТА СТРАНИЦ

### index.html — Главная

| Секция | ID | Класс | Примечания |
|--------|-----|-------|------------|
| Шапка | `#header` | `.header` | Фиксированная, прозрачная, одна строка |
| Hero | `#hero` | `.hero` | bg-image: hero-bg.jpg + тёмный overlay |
| Услуги | `#services` | `.services` | 10 карточек + 10 модальных окон |
| Портфолио | `#portfolio` | `.portfolio` | Табы: квартиры/дома |
| Россия | `#russia` | `.russia` | SVG самолётики, статистика |
| О нас | `#about` | `.about` | Текст + числа + грамоты |
| Достижения | `#achievements` | `.about__awards` | Внутри `.about` секции! |
| Страхи/Гарантии | `#guarantees` | `.fears` | 5 карточек |
| Блог | `#blog` | `.blog` | 3 карточки |
| Калькулятор | `#price` | `.price` | Форма с EmailJS |
| Отзывы | `#reviews` | `.reviews` | Слайдер 17 фото + lightbox |
| Контакты | `#contacts` | `.contacts` | Форма + мессенджеры |
| Подвал | — | `.footer` | 4 колонки |

---

## 🎨 ЦВЕТОВАЯ СИСТЕМА (обновлено 2026-05)

### Палитра — 3 цвета
```css
--dark:     #1A1A2E   /* основной тёмный (тёмно-синий) */
--dark2:    #16213E   /* чуть светлее тёмного */
--accent:   #C9A050   /* тёмное золото (акцент) */
--accent-d: #A8832E   /* тёмное золото при hover */
--light:    #E8E4DC   /* светлый нейтральный (текст на тёмном) */
--light2:   #F2EFE9   /* очень светлый (фоны светлых секций) */
--text-muted: rgba(232,228,220,0.6)  /* приглушённый текст */
--r:        12px
--tr:       0.28s ease
```

### Принцип чередования секций
- **Тёмные** (dark/dark2): hero, portfolio, fears, contacts, reviews, price
- **Светлые** (light2): services, about, blog
- **dark с overlay**: russia

---

## 🏗️ СТРУКТУРА ХЕДЕРА (обновлено 2026-05)

```html
<header class="header" id="header">
  <div class="container header__inner">
    [ЛОГО]
    <div class="header__right">
      <nav class="nav" id="nav">
        [6 nav-link ссылок]
      </nav>
      <span class="header__sep"></span>  <!-- скошенный разделитель -->
      <div class="header__socials">
        [TG] [VK] [WA]  <!-- текст, не иконки -->
      </div>
      <span class="header__sep"></span>
      [Телефон .header__phone]
      <span class="header__sep"></span>
      [10:00–19:00 .header__hours]
      <span class="header__sep"></span>
      [Рассчитать проект .header__cta-btn]
    </div>
    [burger]
  </div>
</header>
```

**Поведение хедера:**
- По умолчанию: `background: transparent` — прозрачный поверх hero
- При скролле > 60px: добавляется класс `.scrolled` → тёмный полупрозрачный фон с blur
- Hover на ссылках: подчёркивание анимируется слева→направо (`scaleX`)

---

## ⚙️ JAVASCRIPT (script.js)

| Функция | Что делает |
|---------|------------|
| Бургер-меню | `.nav--open` на мобильных (< 900px) |
| Прозрачный хедер | `.scrolled` при scroll > 60px |
| Табы портфолио | `.tab-btn[data-tab]` → переключает `.tab-content` |
| Слайдер отзывов | ID: reviewsSlider, reviewsTrack, dots |
| Lightbox | Открытие фото в полный экран |
| Грамоты (scrollAwards) | Горизонтальный скролл |
| Модальные окна | `openModal(id)` / `closeModal(id)` |
| Калькулятор | `calcPrice()` |
| Web3Forms | `submitForm`, `submitLeadForm`, `submitCalcForm` |
| Cookie banner | localStorage 'cookieAccepted' |

**Web3Forms ключ:** `571ed5f8-bdbc-459e-a3e1-aec1c09223b4`

---

## 🐛 ИЗВЕСТНЫЕ ПРОБЛЕМЫ

| # | Проблема | Файл | Строка |
|---|---------|------|--------|
| 1 | `blog1.jpg`, `blog2.jpg`, `blog3.jpg` не существуют | index.html | ~373 |
| 2 | Ссылки Telegram/VK = `yourusername` (плейсхолдеры) | index.html | в header и contacts |
| 3 | «Смотреть проект →» в портфолио ведут на `#` | index.html | |
| 4 | Кнопка «Получить каталог PDF» ведёт на `#catalog` (нет секции) | index.html | |

---

## 🔧 КОМАНДЫ

```bash
# Сервер (HTML-версия)
pkill -f "npx.*serve" 2>/dev/null
cd "/Users/annakareva/Desktop/дизайн нау" && npx -y serve -l 8080 . &
open -a Safari http://localhost:8080

# React dev server
cd "/Users/annakareva/Desktop/дизайн нау/react-app" && npm run dev

# Обновить страницу жёстко
# Cmd+Shift+R в Safari

# Бэкап
cp style.css style_backup.css
cp index.html index_backup.html

# Восстановить оригинал (до редизайна мая 2026)
cp style_backup2.css style.css
cp index_backup2.html index.html
```

---

## 🔀 GIT WORKFLOW (ОБЯЗАТЕЛЬНО)

### Репозиторий
- **GitHub:** `git@github.com:Gamza222/Design-w.git`
- **Главная ветка:** `main`
- **Аккаунт:** `exelate2013`

### ⚡ АЛГОРИТМ ДЛЯ КАЖДОЙ ЗАДАЧИ

**При получении ЛЮБОГО запроса на изменение кода — ВСЕГДА выполнять эту последовательность:**

```
1. SYNC     → git checkout main && git pull origin main
2. BRANCH   → git checkout -b feature/<краткое-описание-задачи>
3. WORK     → вносить изменения в коде
4. COMMIT   → git add -A && git commit -m "описание изменений"
5. PUSH     → git push origin feature/<краткое-описание-задачи>
6. MERGE    → git checkout main && git merge feature/<краткое-описание-задачи>
7. PUSH     → git push origin main
8. CLEANUP  → git branch -d feature/<краткое-описание-задачи>
9. CLEANUP  → git push origin --delete feature/<краткое-описание-задачи>
```

### Правила именования веток
- Формат: `feature/<краткое-описание>` (латиницей, через дефис)
- Примеры: `feature/fix-header-mobile`, `feature/add-blog-images`, `feature/update-calculator`

### Правила коммитов
- Язык коммитов: русский или английский
- Формат: краткое описание что сделано
- Примеры: `"Исправлен мобильный хедер"`, `"Добавлены изображения блога"`

### ⚠️ ВАЖНО
- **НИКОГДА** не работать напрямую в `main` — всегда через feature-ветку
- **ВСЕГДА** делать `git pull origin main` перед созданием ветки
- **ВСЕГДА** пушить и мёрджить после завершения работы
- Если задача мелкая (1 коммит) — всё равно через ветку
- Если задача большая — можно делать промежуточные коммиты в feature-ветке

---

## 🚫 ПРАВИЛА

### НИКОГДА:
- ❌ Переименовывать CSS-классы (JS завязан на них)
- ❌ Удалять id у секций (якорная навигация)
- ❌ Менять `data-tab` атрибуты
- ❌ Трогать Web3Forms ключ
- ❌ Работать напрямую в ветке `main`

### ВСЕГДА:
- ✅ Бэкап перед большими правками
- ✅ Cmd+Shift+R после правок в Safari
- ✅ Проверять `body { padding-top }` в blog.html, article.html (должен быть 72px)
- ✅ Создавать feature-ветку для каждой задачи
- ✅ Коммитить, пушить и мёрджить после завершения

---

## 📋 ИСТОРИЯ

| Дата | Изменение |
|------|-----------|
| 2026-04-29 | Создан сайт с нуля |
| 2026-05-01 | Добавлены blog.html, article.html, portfolio.html |
| 2026-05-02 | Настроена среда Claude (.claude/, CLAUDE.md) |
| 2026-05-02 | Редизайн хедера и всего сайта: 3 цвета (#1A1A2E, #C9A050, #E8E4DC), прозрачный хедер, одна строка, соцсети текстом (TG/VK/WA), hover-подчёркивание |
| 2026-05-04 | Миграция на React + Tailwind (react-app/) |
| 2026-05-14 | GitHub подключён (Gamza222/Design-w), настроен Git workflow с feature-ветками |
