---
name: new-post
description: Создать новую статью блога в MDX сразу на двух языках (RU + EN). Используй, когда нужно добавить пост в content/blog/.
---

# new-post — новая статья блога (RU + EN)

Создаёт MDX-файлы статьи в `content/blog/ru/<slug>.mdx` и `content/blog/en/<slug>.mdx`.
Имя файла = slug в URL (`/blog/<slug>`, `/en/blog/<slug>`).

## Параметры (спроси, если не заданы)
- **slug**: kebab-case (латиница), одинаковый для RU и EN — напр. `small-kitchen-ideas`
- **title / description** на RU и EN
- **cover**: путь к обложке в `public/images/` (можно временно переиспользовать существующую svg)
- **tags**, **author** (по умолчанию `TheDesignNow`)

## Фронтматтер (точно эти поля)
```yaml
---
title: '…'
description: '…'
date: 'YYYY-MM-DD'        # сегодня; список сортируется по date убыванию
cover: '/images/<file>.svg'
tags: ['тег1', 'тег2']
author: 'TheDesignNow'
---
```

## Шаги
1. Создай `content/blog/ru/<slug>.mdx` и `content/blog/en/<slug>.mdx` с фронтматтером выше и текстом
   (заголовки `##`, списки, `>` цитаты — обычный Markdown/MDX).
2. Образец стиля и полей — [content/blog/ru/small-apartment.mdx](../../../content/blog/ru/small-apartment.mdx).
3. **Rebuild обязателен**: `ssr:false` ⇒ контент собирается на build-time, новые пути
   прелендерятся только после `npm run build` (dev-сервер подхватит через HMR).

## Проверка
- `npm run build` — в логе должны появиться `Prerender (html): /blog/<slug>` и `/en/blog/<slug>`.
- Статья видна в списке `/blog` и `/en/blog` и открывается по прямой ссылке.
- Если перевод только на одном языке — создай файл лишь для него (путь для другой локали не эмитится).
