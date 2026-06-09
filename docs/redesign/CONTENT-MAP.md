# CONTENT-MAP — «что менять и где»

Карта для владельца сайта: **чтобы изменить X — правь файл Y**. Принцип: *слова* живут в i18n-JSON
(главная поверхность редактирования), *статьи и проекты* — в MDX, *картинки* — в `/public/images`,
а «проводка» (иконки, координаты, цены-числа, флаги) — в типизированных TS-конфигах (правится редко).
Тексты RU и EN зеркальны: меняешь в `ru.json` — продублируй в `en.json` тот же ключ.

> После правок MDX-контента или TS-конфигов нужен `npm run build` (сайт статический, пути генерятся на
> сборке). Правки только в i18n-JSON подхватываются без пересборки в dev.

## 1. Тексты сайта (заголовки, кнопки, описания, FAQ, отзывы, страхи…)

**Файлы:** `src/shared/config/i18n/locales/ru.json` и `en.json` (структура зеркальна).

| Хочу поменять | Ключ в JSON |
|---|---|
| Пункты меню, кнопки | `nav.*`, `cta.*` |
| Тексты Hero | `home.hero.*` |
| Заголовки секций главной | `home.services.*`, `home.process.*`, `home.portfolio.*`, `home.geography.*`, `home.fears.*`, `home.blog.*`, `home.calculator.*`, `home.faq.*`, `home.reviews.*`, `home.contactCta.*` |
| Пакеты: названия и цены | `home.packages.items.*`, фичи — `home.packages.features.*` |
| Вопросы-ответы FAQ | `home.faq.items` (массив) |
| Опасения клиента (страхи) | `home.fears.items` (массив: вопрос + ответ) |
| Отзывы (текст) | `home.reviews.items` (массив) |
| Статы географии (50+, 30 мин…) | `home.geography.stats` (массив) |
| Тексты SEO-страниц услуг | `servicePages.*` |
| Футер (слоган, ссылки, документы) | `footer.*` |

## 2. Статьи блога

**Папка:** `content/blog/ru/<slug>.mdx` + `content/blog/en/<slug>.mdx`.
**Как добавить:** скил `/new-post` (создаёт пару RU+EN с правильным frontmatter), затем `npm run build`.
Frontmatter: `title, description, date, cover, category, tags, author`. Тело — Markdown + врезки
(`⚠️ ошибка / 💡 что делаем / ✔️ как избежать`). Обложка — путь в `cover:` → файл в `/public/images`.

## 3. Проекты портфолио (кейсы)

**Папка:** `content/portfolio/ru/<slug>.mdx` + `content/portfolio/en/<slug>.mdx`.
**Как добавить:** скил `/new-project`, затем `npm run build`. Frontmatter: `title, description, year,
location (город), area (м²), style, type (тип объекта), cover, gallery (по комнатам), highlights
(«что было важно»), plan, materials, services`. Картинки — пути в frontmatter → файлы в `/public/images`.

## 4. Картинки

**Папка:** `public/images/`. Кладёшь файл → указываешь путь:
- для пакетов/услуг/секций — в `config/images.ts` соответствующего виджета/сущности;
- для статей/проектов — во frontmatter MDX (`cover`, `gallery`, …).
Один путь — одно место. (Оптимизация форматов/размеров — задача Фазы 7.)

## 5. Цены, услуги, структура (правится редко, dev)

| Что | Файл |
|---|---|
| Какие пакеты есть, фичи, флаг «популярный», картинка | `src/entities/package/model/packages.ts` + `config/images.ts` |
| Правила цен калькулятора (₽/м², доп.услуги, сроки) | `src/entities/package/model/pricing.ts` *(вводится на Фазе 5)* |
| Доп.услуги (3D, надзор, комплектация…) | `src/entities/service/model/services.ts` |
| Этапы процесса (иконка + срок) | `src/widgets/process/config/steps.ts` *(Фаза 2)* |
| Города на карте (имя + координаты) | `src/widgets/geography/config/cities.ts` *(Фаза 2)* |
| Телефон, соцсети | `src/shared/config/contacts.ts` |
| Адрес/часы работы | i18n: `header.hours`, `contact.*` |

## 6. Что НЕ требует пересборки vs требует

- **Без пересборки (dev hot-reload):** правки в `ru.json`/`en.json`.
- **Нужен `npm run build`:** новые/изменённые MDX (блог, портфолио), правки TS-конфигов (цены, услуги,
  города, этапы, контакты, пути картинок).
