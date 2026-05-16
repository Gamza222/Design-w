# CLAUDE.md — Технический контекст проекта «Дизайн Сейчас»

> Автоматически читается Claude при каждом обращении к проекту.

---

## 📁 ФАЙЛОВАЯ СТРУКТУРА (FSD)

```
Design-w/
├── src/
│   ├── app/
│   │   ├── App.jsx          # BrowserRouter + Layout (Header/Footer/CookieBanner)
│   │   └── index.css        # Глобальные стили + Tailwind + CSS-компоненты
│   ├── pages/
│   │   ├── HomePage/
│   │   │   ├── index.jsx    # Сборник всех секций главной
│   │   │   └── sections/    # Hero, Services, HowWeWork, Portfolio, Russia,
│   │   │                    # About, Fears, Blog, FAQ, Contacts
│   │   ├── PortfolioPage/index.jsx
│   │   ├── BlogPage/index.jsx
│   │   └── ArticlePage/index.jsx
│   ├── features/
│   │   ├── Calculator/index.jsx   # Калькулятор: тарифы (radio) + доп.услуги (checkbox)
│   │   ├── Reviews/index.jsx      # Слайдер отзывов + lightbox
│   │   └── ServiceModal/index.jsx # Модальное окно услуги
│   ├── widgets/
│   │   ├── Header/index.jsx       # Хедер с React Router навигацией
│   │   ├── Footer/index.jsx       # Футер
│   │   └── CookieBanner/index.jsx
│   ├── shared/
│   │   ├── data/
│   │   │   ├── services.js  # tariffs[] + extras[] + services[] (все вместе)
│   │   │   ├── content.js   # blogPosts[], portfolioFlats[], portfolioHouses[]
│   │   │   └── reviews.js   # reviews[] (17 фото)
│   │   ├── ui/
│   │   │   └── FadeInView.jsx
│   │   └── hooks/
│   │       └── useScrollReveal.js
│   └── main.jsx             # React entry point
├── public/
│   ├── gramota1.jpg, gramota2.jpg
│   ├── hero-bg.jpg
│   ├── review1-17.jpg
│   ├── russia-map.png
│   └── лого для сайта дизайн сейчас.png
├── index.html               # Vite entry HTML
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── CLAUDE.md
```

---

## 🗺️ КАРТА РОУТОВ

| URL | Компонент | Описание |
|-----|-----------|----------|
| `/` | `HomePage` | Главная со всеми секциями |
| `/portfolio` | `PortfolioPage` | Полное портфолио (табы: квартиры/дома) |
| `/blog` | `BlogPage` | Все 6 статей |
| `/blog/:id` | `ArticlePage` | Статья по id (1-6) |

---

## 🎨 ЦВЕТОВАЯ СИСТЕМА

```css
/* ТЁМНЫЕ секции (Hero, HowWeWork, Portfolio, Russia, Blog, Calculator, Reviews) */
#1C2340  /* основной тёмный */
#243050  /* чуть светлее (Russia, Contacts, Reviews) */
#1E2240  /* карточки на тёмном */

/* СВЕТЛЫЕ секции (Services, About, Fears, FAQ, BlogPage, PortfolioPage) */
#F7F4EF  /* кремово-белый фон */
#FFFFFF  /* карточки на светлом */

/* АКЦЕНТ */
#C9A97A  /* золото */
#B8852E  /* тёмное золото при hover */
#F5B800  /* яркое золото (градиент) */

/* ТЕКСТ */
#E8E4DC  /* светлый текст (на тёмном фоне) */
#1C2340  /* тёмный текст (на светлом фоне) */
```

### CSS-классы в index.css
- `.section-tag` / `.section-title` / `.section-sub` — для тёмных секций
- `.section-tag-dark` / `.section-title-dark` / `.section-sub-dark` — для светлых секций
- `.service-card` — карточка на тёмном фоне
- `.service-card-light` — карточка на светлом фоне
- `.form-input` — инпут на тёмном фоне
- `.form-input-light` — инпут на светлом фоне
- `.btn-gold` — золотая кнопка
- `.btn-outline` — контурная кнопка
- `.btn-dark` — тёмная кнопка

---

## ⚙️ КАЛЬКУЛЯТОР (features/Calculator)

**Данные: `shared/data/services.js`**

```
tariffs[] — 5 тарифов (radio, только один)
  tariff4, tariff5 — имеют includes3D: true

extras[] — 5 доп.услуг (checkbox, несколько)
  extra3d — заблокирован при tariff4/tariff5 (показывает badge "Включено")
```

---

## 🔧 КОМАНДЫ

```bash
# Dev сервер (из корня)
npm run dev

# Продакшен сборка
npm run build

# Проверить что собирается
npm run build && echo "OK"
```

---

## 🔀 GIT WORKFLOW — ПОЛНЫЙ АВТОПИЛОТ

### Репозиторий
- **GitHub:** `git@github.com:Gamza222/Design-w.git`
- **Главная ветка:** `main`

### Автоматическая классификация веток

| Тип задачи | Префикс |
|-------------|---------|
| Новая функция | `feature/` |
| Исправление бага | `fix/` |
| Визуальные правки | `design/` |
| Рефакторинг | `refactor/` |
| Срочный фикс | `hotfix/` |
| Контент | `content/` |

### Полный цикл задачи
```
1. git checkout main && git pull origin main
2. git checkout -b <тип>/<описание>
3. Вносить изменения
4. npm run build — проверить
5. git add -A && git commit -m "описание"
6. git push origin <ветка>
7. git checkout main && git merge <ветка>
8. git push origin main
9. git branch -d <ветка> && git push origin --delete <ветка>
```

### Чеклист перед мёрджем
- [ ] `npm run build` — без ошибок
- [ ] Роуты `/`, `/portfolio`, `/blog`, `/blog/:id` работают
- [ ] Web3Forms ключ не тронут: `571ed5f8-bdbc-459e-a3e1-aec1c09223b4`
- [ ] ID секций сохранены (`#hero`, `#services`, `#portfolio`, `#about`, `#achievements`, `#blog`, `#price`, `#reviews`, `#contacts`)

---

## 🐛 ИЗВЕСТНЫЕ ПРОБЛЕМЫ

| # | Проблема | Файл |
|---|---------|------|
| 1 | Telegram/VK ссылки = `yourusername` (плейсхолдеры) | Header, Footer, Contacts |
| 2 | Изображения blog1-6.jpg не существуют → показывается заглушка-номер | BlogPage, ArticlePage |
| 3 | Кнопка «Получить каталог PDF» ведёт на `#catalog` (секции нет) | Portfolio секция |

---

## 📋 ИСТОРИЯ

| Дата | Изменение |
|------|-----------|
| 2026-04-29 | Создан сайт с нуля |
| 2026-05-01 | Добавлены blog.html, article.html, portfolio.html |
| 2026-05-02 | Настроена среда Claude (.claude/, CLAUDE.md) |
| 2026-05-02 | Редизайн хедера: 3 цвета (#1A1A2E, #C9A050, #E8E4DC) |
| 2026-05-04 | Миграция на React + Tailwind (react-app/) |
| 2026-05-14 | GitHub подключён (Gamza222/Design-w) |
| 2026-05-16 | Большой рефакторинг: FSD-структура, React Router, светлые секции, обновлённый калькулятор |
