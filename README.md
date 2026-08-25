# TheDesignNow

Мультиязычный имиджевый сайт студии дизайна интерьера: услуги, портфолио, блог. Быстрый,
SEO-friendly, статический (SSG), контент пополняется через MDX.

## Стек

Vite · React 19 · TypeScript (strict) · React Router v7 (framework mode, `ssr:false` + prerender →
статика) · react-i18next (RU + EN) · MDX · SCSS Modules + CSS-переменные · GSAP/ScrollSmoother ·
Vitest + Playwright · ESLint/Steiger/Stylelint/Prettier · деплой на Vercel.

Архитектура — [Feature-Sliced Design](https://feature-sliced.design): `src/{app,pages,widgets,features,entities,shared}`.

## Команды

```bash
npm install          # установка зависимостей
npm run dev          # дев-сервер (http://localhost:5173)
npm run build        # сборка + prerender в build/client
npm run preview      # отдать собранную статику (http://localhost:3000)

npm run typecheck    # react-router typegen + tsc
npm run lint         # ESLint + Stylelint
npm run lint:fsd     # Steiger (границы FSD)
npm test             # Vitest
npm run e2e          # Playwright (поднимает build + preview сам)
```

## Контент

- Блог: `content/blog/{ru,en}/<slug>.mdx`
- Портфолио: `content/portfolio/{ru,en}/<slug>.mdx`

После добавления MDX нужен `npm run build` (статическая сборка, без on-demand).

## Деплой

Статика на Vercel: Build Command `npm run build`, Output Directory `build/client`
(SPA-fallback настроен в `vercel.json`).

---

Внутренняя документация для ИИ-агента и подробные правила — в [CLAUDE.md](CLAUDE.md).
