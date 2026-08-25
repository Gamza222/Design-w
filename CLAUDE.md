# CLAUDE.md — TheDesignNow

Мультиязычный имиджевый лендинг студии дизайна интерьера. Статический сайт (SSG), быстрый,
SEO-friendly, контент пополняется через MDX. Работаем **лаконично, без оверинжиниринга**,
строго по FSD. Общение и комментарии — на русском.

## Стек

- **Vite + React 19 + TypeScript (strict)**
- **React Router v7** (framework mode, `ssr: false` + `prerender()` → полностью статический вывод)
- **react-i18next** — RU по умолчанию (`/…`) + EN (`/en/…`); локали-ресурсы забандлены
- **Контент в MDX** — `content/blog/{ru,en}` и `content/portfolio/{ru,en}`, грузится на build-time
  через `import.meta.glob`
- **SCSS Modules + CSS-переменные** — палитра в `src/app/styles/tokens.scss`
- **GSAP + @gsap/react** (`useGSAP`) — ScrollTrigger-анимации (reveal по скроллу, параллакс Hero);
  скролл нативный (ScrollSmoother убран при редизайне)
- **Тесты**: Vitest + RTL (unit/component) · Playwright (e2e против собранной статики)
- **Качество**: ESLint · Steiger (границы FSD) · Stylelint · Prettier
- **npm** · деплой **Vercel** (статика, `outputDirectory: build/client`)

## Архитектура FSD

Слои в `src/`: `app → pages → widgets → features → entities → shared`.

- **Импорт только вниз** по слоям. `shared` не импортит ничего из верхних слоёв.
- **Public API через `index.ts`**: каждый слайс экспортирует наружу только через свой `index.ts`.
  Импортируем через alias и public API — `import { X } from '@widgets/header'`, **без deep-путей**
  типа `@widgets/header/ui/...`.
- Алиасы: `@app @pages @widgets @features @entities @shared` (см. `tsconfig.json`).
- **Нюанс app/RR7**: каталог фреймворка совпадает с FSD app-слоем (`appDirectory: 'src/app'`).
  `root.tsx`, `routes.ts`, `entry.client.tsx`, `entry.server.tsx` — это инфраструктура RR7 внутри
  app-слоя; для них в `steiger.config.ts` точечные исключения. **`entry.server.tsx` обязан рендерить
  потоково** (`renderToReadableStream` + `await allReady`) — иначе данные гидрации не попадут в HTML
  и клиент не гидрируется (см. «Подводные камни»).

## npm-скрипты

| Скрипт | Что делает |
|---|---|
| `npm run dev` | dev-сервер (React Router / Vite), :5173 |
| `npm run build` | сборка + prerender всех маршрутов в `build/client/` |
| `npm run preview` | отдать собранную статику на :3000 |
| `npm run typecheck` | `react-router typegen` + `tsc` |
| `npm run lint` | ESLint + Stylelint |
| `npm run lint:fix` | то же с автофиксом |
| `npm run lint:fsd` | Steiger (границы FSD) |
| `npm test` | Vitest (run) |
| `npm run e2e` | Playwright (сам делает build + preview) |
| `npm run format` / `format:check` | Prettier |

## Git-флоу

В `main` напрямую не коммитим (кроме первичного bootstrap). На каждую задачу — ветка:

1. `git checkout -b feat/<кратко>`
2. Работа → коммиты. Перед PR — **чек-лист** (ниже).
3. `git push -u origin feat/<…>` → `gh pr create`.
4. Дождаться зелёного CI и preview-деплоя Vercel.
5. Merge → `git checkout main && git pull` → убедиться, что локалка == remote (`git status`).

Футер коммитов: `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`.

## Рецепты

- **Новый пост** → скил `new-post` (RU+EN MDX в `content/blog/`). Затем `npm run build`.
- **Новый проект портфолио** → скил `new-project` (RU+EN MDX в `content/portfolio/`). Затем `npm run build`.
- **Новый слайс** → скил `new-slice` (`widgets|features|entities` + public API).
- **i18n-ключ** → добавить в `src/shared/config/i18n/locales/ru.json` **и** `en.json`
  (структура зеркальна; верхние ключи: `brand, nav, cta, header, home, services, portfolio, blog,
  achievements, about, contact, footer, servicePages, notFound`). В компонентах —
  `const { t } = useTranslation(); t('blog.title')`.
- **SEO-посадка услуги** → путь в `SERVICE_LANDINGS` (`src/shared/config/routes.ts`, автоматом попадает
  в prerender/sitemap), роут в `src/app/routes.ts` (модуль `pages/service/ui/ServicePage.tsx` общий),
  контент — ключ в `servicePages.*` (ru+en). Хаб-карточки на `/services` строятся из `SERVICE_LANDINGS`.
- **Sitemap** генерится в `npm run build` (`scripts/generate-sitemap.mjs` обходит `build/client`).
- **Сменить палитру** → править **только** «сырые» цвета в `src/app/styles/tokens.scss` (`--clr-*`);
  компоненты используют семантические токены (`--color-text`, `--color-accent` и т.д.).
- **Прогнать тесты** → `npm test` (unit) · `npm run e2e` (e2e).
- **Локальный preview** → `npm run preview` (`scripts/preview.mjs`, порт 3000, хост 127.0.0.1) —
  зеркалит Vercel: `/services` → `services/index.html`, неизвестный путь → `__spa-fallback.html` (200).
  `vite preview` не годится: его SPA-режим отдаёт корневой `index.html` для любых путей без хвостового
  слэша → на каждой странице кроме главной ловится hydration mismatch (React #418).
- **Портфолио «все в строку на больших экранах»** (быстрый откат) → сейчас лента «Примеры наших работ»
  ограничена **макс. 4 в ряд** + кнопка «Ещё» раскрывает остальные (`Projects.module.scss` → `.gallery`
  колонки `1 → 2(sm) → 3(md) → 4(xl)`; правила `.gallery:not(.expanded) > :nth-child(n+…)` прячут «хвост» за
  первой строкой; кнопка `.moreBtn` + state `expanded` в `Projects.tsx`). **Чтобы вернуть «все 6 в один
  ряд» на больших экранах:** в `.gallery` поставить на `up(xl)`/`up(wide)` `grid-template-columns:
  repeat(6, minmax(0,1fr))`, убрать (или закрыть медиазапросом) правила скрытия `:nth-child` и скрыть
  `.moreBtn` на этих брейкпоинтах (либо не рендерить кнопку, когда всё влезает). Остальное (full-bleed,
  заголовок слева на `wide`, контраст подписи) не трогать.

## Чек-лист перед PR

```
npm run typecheck && npm run lint && npm run lint:fsd && npm test && npm run build && npm run e2e
```

Все шесть должны быть зелёными.

## Адаптив / масштабирование (флюид)

Сайт масштабируется **флюидно** через корневой `font-size` — весь rem-дизайн пропорционально «зумится»
вместе с шириной экрана, а не ступенчато по брейкпоинтам.

- **Корень:** `html { font-size: clamp(14px, 0.8333vw, 33.33px) }` (`src/app/styles/reset.scss`).
  Формула собирается из SCSS-переменных в `src/app/styles/abstracts.scss`:
  `$site-base-width: 1920` (база — **главная «ручка» общего размера**: на 1920px `1rem = 16px`),
  `$site-fs-min: 14` (пол на узких десктоп/планшет), `$site-max-width: 4000` (кап). Числа **безразмерные** —
  единицы навешиваются при интерполяции в `clamp()` (иначе `16px/1920` даёт `px` и `…pxvw` ломает CSS).
- **Кап ширины:** `body { max-width: var(--site-max) /*4000px*/; margin-inline: auto }`,
  тёмный фон полей за пределами — `html { background: var(--clr-dark) }` (`src/app/styles/global.scss`).
  Фиксированный `Header` капается отдельно тем же `max-width + margin-inline: auto`.
- **Правило единиц:** всё, что должно зумиться (размеры, отступы, иконки, высота хедера) — в **rem**;
  «физические» мелочи (бордеры `1px`, `outline`/`outline-offset` фокуса) — оставляем в **px**.
- **px-медиазапросы (`$bp-*`) на флюид НЕ реагируют** (они абсолютные) → брейкпоинт бургера `down(xl)` стабилен.
- **Единый боковой гаттер:** `--page-gutter: clamp(1.25rem, 6vw, 7.5rem)` (`tokens.scss`) — одинаковая
  боковая линия у навбара и контента. Глобальный `--container-pad` ссылается на него, поэтому все
  `<Container>` выровнены. rem-член clamp **замораживает гаттер ~на 4000px** (корневой `font-size` там капнут).
- **Full-bleed vs контентные секции:** хедер, **Hero** и **«Пакеты»** на своём `.inner` локально ставят
  `--container-max: var(--site-max)` → тянутся до гаттера, края совпадают с навбаром. Остальные секции
  держат глобальный `--container-max: 80rem` (кап читабельности; **в rem** — на 1920 это 1280px, а выше
  растёт вместе с флюид-зумом: кап в px «сжимал» секции на >1920 — переносы по слову, наложения карточек). Главный экран собран из `@widgets/hero` + `@widgets/packages` (+ `@entities/package`,
  data-driven пакеты, картинки сгруппированы в `config/images.ts`).
- **TODO (follow-up):** `--fs-4xl: clamp(2.75rem, 6vw, 5rem)` у `h1` — «двойной флюид» (и rem, и vw зависят
  от ширины); упростить до плоского rem. Доводка остальных секций (услуги/шаги/футер) под макет — отдельно.

## Подводные камни

- **`ssr: false` ⇒ пути деталок только литеральные.** `:slug` не разворачивается автоматически —
  список путей prerender генерится из `content/` (`src/shared/lib/mdx/prerender-paths.ts`).
  Новый MDX виден в сборке **только после `npm run build`** (без on-demand).
- **`entry.server.tsx` — потоковый рендер.** `renderToString` ломает гидрацию (нет данных в HTML →
  клиент висит на `__reactRouterContext.stream`). Используем `renderToReadableStream` + `await allReady`.
- **GSAP — только внутри `useGSAP`.** Reveal по скроллу — общий хук `useScrollReveal` (`@shared/lib`),
  уважает `prefers-reduced-motion` и ждёт ухода прелоадера. Никакого `window`/`document` во время рендера.
- **prerender-хелпер исполняется в Node** (без React/`import.meta`) — отдельный reader на `gray-matter`.
- **Vitest держим без плагина reactRouter** (`vitest.config.ts` отдельно).
