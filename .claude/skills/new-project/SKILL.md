---
name: new-project
description: Добавить новый проект в портфолио в MDX сразу на двух языках (RU + EN). Используй, когда нужно добавить кейс в content/portfolio/.
---

# new-project — новый проект портфолио (RU + EN)

Создаёт MDX-файлы проекта в `content/portfolio/ru/<slug>.mdx` и `content/portfolio/en/<slug>.mdx`.
Имя файла = slug в URL (`/portfolio/<slug>`, `/en/portfolio/<slug>`).

## Параметры (спроси, если не заданы)
- **slug**: kebab-case (латиница), одинаковый для RU и EN — напр. `coastal-villa`
- **title / description** на RU и EN
- **year**, **location**, **area** (м², число), **style**
- **cover** + **gallery**: пути в `public/images/`
- **services**: ключи услуг (напр. `turnkey`, `planning`) — см. сущность service

## Фронтматтер (точно эти поля)
```yaml
---
title: '…'
description: '…'
year: 2025                 # число
location: '…'
area: 64                   # число, м²
style: '…'
cover: '/images/<file>.svg'
gallery: ['/images/<a>.svg', '/images/<b>.svg']
services: ['turnkey', 'planning']
---
```

## Шаги
1. Создай оба файла с фронтматтером выше и описанием кейса (Markdown/MDX).
2. Образец полей и стиля — [content/portfolio/ru/minimal-loft.mdx](../../../content/portfolio/ru/minimal-loft.mdx).
3. **Rebuild обязателен**: `ssr:false` ⇒ пути прелендерятся только после `npm run build`.

## Проверка
- `npm run build` — в логе `Prerender (html): /portfolio/<slug>` и `/en/portfolio/<slug>`.
- Проект виден в сетке `/portfolio` и `/en/portfolio` и открывается по прямой ссылке.
- Перевод только на одном языке → создаём файл лишь для него.
