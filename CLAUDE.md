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
- **GSAP + @gsap/react** (`useGSAP`) — ScrollSmoother (плавный скролл), анимации
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
  (структура зеркальна; верхние ключи: `brand, nav, cta, home, services, portfolio, blog, about,
  contact, footer, notFound`). В компонентах — `const { t } = useTranslation(); t('blog.title')`.
- **Сменить палитру** → править **только** «сырые» цвета в `src/app/styles/tokens.scss` (`--clr-*`);
  компоненты используют семантические токены (`--color-text`, `--color-accent` и т.д.).
- **Прогнать тесты** → `npm test` (unit) · `npm run e2e` (e2e).

## Чек-лист перед PR

```
npm run typecheck && npm run lint && npm run lint:fsd && npm test && npm run build && npm run e2e
```

Все шесть должны быть зелёными.

## Подводные камни

- **`ssr: false` ⇒ пути деталок только литеральные.** `:slug` не разворачивается автоматически —
  список путей prerender генерится из `content/` (`src/shared/lib/mdx/prerender-paths.ts`).
  Новый MDX виден в сборке **только после `npm run build`** (без on-demand).
- **`entry.server.tsx` — потоковый рендер.** `renderToString` ломает гидрацию (нет данных в HTML →
  клиент висит на `__reactRouterContext.stream`). Используем `renderToReadableStream` + `await allReady`.
- **GSAP ScrollSmoother — синглтон.** Инициализация в `useGSAP`, через `ScrollSmoother.get() ?? create()`;
  на SPA-навигации `ScrollSmoother.get()?.refresh()`. Никакого `window`/`document` во время рендера.
- **prerender-хелпер исполняется в Node** (без React/`import.meta`) — отдельный reader на `gray-matter`.
- **Vitest держим без плагина reactRouter** (`vitest.config.ts` отдельно).
