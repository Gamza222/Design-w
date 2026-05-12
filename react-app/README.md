# Дизайн Сейчас — React-версия сайта

## Технологии
- **React 18** + **Vite 5**
- **Tailwind CSS 3**
- **Web3Forms** (отправка заявок)

## Как запустить

### 1. Установить зависимости
```bash
npm install
```

### 2. Запустить в режиме разработки
```bash
npm run dev
```

Откройте в браузере: **http://localhost:5173**

### 3. Сборка для продакшена
```bash
npm run build
```

## Структура проекта

```
src/
├── App.jsx               # Корневой компонент
├── main.jsx              # Точка входа
├── index.css             # Глобальные стили + Tailwind
├── data/
│   ├── services.js       # Данные об услугах (10 пакетов)
│   ├── reviews.js        # Список фото отзывов
│   └── content.js        # Блог, портфолио
└── components/
    ├── Header.jsx         # Шапка + навигация
    ├── Hero.jsx           # Первый экран
    ├── Services.jsx       # Услуги
    ├── ServiceModal.jsx   # Модальное окно услуги
    ├── Portfolio.jsx      # Портфолио с табами
    ├── Russia.jsx         # Карта России
    ├── About.jsx          # О студии
    ├── Fears.jsx          # Гарантии
    ├── Blog.jsx           # Блог
    ├── Calculator.jsx     # Калькулятор
    ├── Reviews.jsx        # Слайдер отзывов + лайтбокс
    ├── Contacts.jsx       # Контакты + форма
    ├── Footer.jsx         # Подвал
    └── CookieBanner.jsx   # Баннер cookie

public/
    ├── hero-bg.jpg
    ├── russia-map.png
    ├── лого для сайта дизайн сейчас.png
    ├── gramota1.jpg
    ├── gramota2.jpg
    └── review1.jpg ... review17.jpg
```

## Изменение контента

- **Услуги** → `src/data/services.js`
- **Отзывы** → добавьте фото в `public/` и обновите `src/data/reviews.js`
- **Блог** → `src/data/content.js`
- **Телефон, email** → найдите через поиск по проекту

## Настройка цветов

Цвета брендовой палитры в `tailwind.config.js`:
- `gold` — золотой (#C9A97A и оттенки)
- `dark` — тёмный фон (#1A1A2E)
- `cream` — светлый текст (#E8E4DC)

## Web3Forms (отправка форм)

Ключ API прописан в компонентах `Services.jsx`, `Calculator.jsx`, `Contacts.jsx`:
```
571ed5f8-bdbc-459e-a3e1-aec1c09223b4
```
