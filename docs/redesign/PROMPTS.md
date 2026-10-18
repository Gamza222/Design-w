# Промты по фазам (для новых чатов)

Открывай **новый чат** на каждую фазу и вставляй соответствующий блок. Каждая фаза идёт в ветке
`feat/tz-redesign`, начинается с чтения `docs/redesign/ROADMAP.md` + `CONTENT-MAP.md`, заканчивается
зелёным чек-листом и коммитом. **В `main` не мёржим.** Идти строго по порядку (0 → 7).

> Ветка `feat/tz-redesign` и папка `docs/redesign/` уже созданы. Референсы — `docs/tz-refs/*.png`.

---

## Фаза 0 — Фундамент
```
Ветка feat/tz-redesign. Прочитай CLAUDE.md, docs/redesign/ROADMAP.md и docs/redesign/CONTENT-MAP.md,
мокапы в docs/tz-refs/. ФАЗА 0 — Фундамент дизайн-системы (без новых секций). Введи тональность секций:
Section tone="dark"|"light"|"glass", которая переопределяет семантические токены (--color-bg/-surface/
-text/-text-muted/-border) — компоненты пишем theme-agnostic, без хардкода цвета; сырьё --clr-* не
трогаем. Добавь в tokens.scss тёмные поверхности/бордеры, glass (blur+прозрачность+тонкая золотая линия),
--glow-accent, ритм секций. Добавь shared-примитивы в src/shared/ui: SectionHeader (eyebrow+title+
subtitle), Input/Textarea/Field, PillToggle, Checkbox, Accordion, Badge/Tag, Stat, IconBadge, Breadcrumbs,
Stepper, Rating, GlassPanel; проп tone у Section; размеры у Button; расширь Icons.tsx. Добавь useReveal()
в src/shared/lib (fade-up по скроллу, безопасно к prefers-reduced-motion). Разверни в ru.json+en.json
полное дерево i18n-ключей под все секции воронки (см. ROADMAP; RU из ТЗ, EN перевод). Отполируй ДИЗАЙН
Hero и Header (контент/копирайт НЕ меняем; упрости --fs-4xl у h1 до плоского rem). Строго FSD, флюид
rem+clamp, токены вместо хардкода, prefers-reduced-motion, public API через index.ts. Скил ui-ux-pro-max.
В конце: npm run typecheck && npm run lint && npm run lint:fsd && npm test && npm run build && npm run e2e
— всё зелёное, закоммить (footer: Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>).
НЕ мёржить в main.
```

## Фаза 1 — Блок услуг + SEO-страницы услуг
```
Ветка feat/tz-redesign. Прочитай docs/redesign/ROADMAP.md + CONTENT-MAP.md. ФАЗА 1 — Блок услуг на
главной + SEO-страницы услуг. Реф: docs/tz-refs/02-packages-block.png и 03-package-card-full.png (PDF
стр. 3–9). Секция «Дизайн-проект под любую задачу» (светлая): SectionHeader + 4 главных пакета (мини-
рендер, номер, название, короткое описание, «от X ₽/м²», раскрытие «что входит»), сетка доп.услуг,
«Кому подойдут наши услуги» (5 иконок), тёмная мини-CTA «Не знаете что выбрать?» (форма-заглушка).
Деталь пакета: «Что вы получите» (грид мини-рендеров), сроки/формат/гео, цена, CTA. 3 SEO-посадки:
/planirovka-kvartiry, /3d-vizualizaciya-interera, /eskiznyj-dizajn-proekt (H1, текст, что входит, FAQ,
кейсы из портфолио, цена, сроки, CTA) — роуты в app/routes.ts, ROUTES и STATIC_PATHS, prerender. Расширь
entities/package и entities/service. Тексты в i18n, структура в TS-конфигах. Строго FSD, флюид, токены,
reduced-motion, ui-ux-pro-max. Чек-лист зелёный, закоммить. НЕ мёржить.
```

## Фаза 2 — Процесс + География
```
Ветка feat/tz-redesign. Прочитай docs/redesign/ROADMAP.md + CONTENT-MAP.md. ФАЗА 2 — Процесс + География
(тёмные секции). Рефы: docs/tz-refs/04-process-block.png (PDF 9–12) и 06-geo-russia-map.png (PDF 18–20).
widgets/process «Продумываем интерьер до начала ремонта»: тёмная, 4 этапа на тонкой анимированной
горизонтальной линии (подсветка след. шага по скроллу), у этапа иконка/номер/заголовок/текст/мини-
визуал/срок, ряд из 4 мини-выгод, CTA. Конфиг этапов в config/steps.ts. widgets/geography «Делаем дизайн-
проекты удалённо по всей России»: тёмная, лёгкая inline-SVG карта РФ, 3–5 самолётиков по дугам, точки
городов с tooltip, ряд статов (50+/30мин/24-7/0₽), «Как работает удалённый формат» (3 шага), CTA. Города
в config/cities.ts (имя+x/y). Без тяжёлых map-библиотек. Переиспользуй useReveal. Тексты в i18n. Строго
FSD, флюид, токены, reduced-motion, ui-ux-pro-max. Чек-лист зелёный, закоммить. НЕ мёржить.
```

## Фаза 3 — Портфолио + страница проекта
```
Ветка feat/tz-redesign. Прочитай docs/redesign/ROADMAP.md + CONTENT-MAP.md. ФАЗА 3 — Портфолио (грид) +
страница проекта (кейс). Реф: docs/tz-refs/05-portfolio-gallery.png (PDF 13–17). Главная «Примеры наших
работ» (тёмная): mix-grid (1 большая+2 средних+4 маленьких), карточка = крупное фото + бейдж стиля +
hover («затемнение уходит, Смотреть проект →») + мета снизу (название/площадь/город/тип), чипы категорий.
/portfolio — полный mix-grid + фильтры (стиль/тип) + счётчик. /portfolio/:slug (кейс): большой hero-
рендер + мета справа (площадь/стиль/город/сроки/тип), история, full-width галерея по комнатам, «что было
важно» (мини-карточки), навигация по комнатам (scroll-to), планировка, материалы, CTA, SEO. Обнови
entities/project (frontmatter: галерея по комнатам, highlights, план, материалы, тип, стиль, город) и
скил new-project. Строго FSD, флюид, токены, reduced-motion, ui-ux-pro-max. Чек-лист зелёный (npm run
build обязателен — prerender путей). НЕ мёржить.
```

## Фаза 4 — Страхи + Блог
```
Ветка feat/tz-redesign. Прочитай docs/redesign/ROADMAP.md + CONTENT-MAP.md. ФАЗА 4 — Страхи + Блог
(главная + список + статья). Рефы: docs/tz-refs/07-fears-block.png (PDF 21–25) и 08-blog.png (PDF 25–29).
widgets/fears «Ремонт не должен превращаться в стресс» (светлая, editorial): слева eyebrow «МЫ ПОНИМАЕМ
ВАШИ ОПАСЕНИЯ» + крупный заголовок + подзаголовок + малый CTA; справа conversational-лента (иконка +
вопрос-страх + человеческий ответ), hover-мини-рендер. Блог на главной: 3 карточки статей (категория-чип,
заголовок, лид, дата, время чтения, стрелка, hover) + «Смотреть все статьи», визуально отличается от
портфолио. /blog — все статьи + категории + поиск + пагинация. /blog/:slug — хлебные крошки, заголовок,
обложка, оглавление, текст с врезками (⚠️/💡/✔️ как MDX-компоненты), end-CTA «Хотите избежать этих
ошибок?», 2–3 связанные статьи. Обнови entities/post (категории), скил new-post, расширь Prose врезками.
Строго FSD, флюид, токены, reduced-motion, ui-ux-pro-max. Чек-лист зелёный (build обязателен). НЕ мёржить.
```

## Фаза 5 — Калькулятор
```
Ветка feat/tz-redesign. Прочитай docs/redesign/ROADMAP.md + CONTENT-MAP.md. ФАЗА 5 — Калькулятор
(интерактивный конфигуратор). Реф: docs/tz-refs/09-calculator.png (PDF 30–34). Перепиши
features/estimate-form в features/project-calculator (тёмная секция): шаг 1 — формат (4 премиум
selectable-карточки), шаг 2 — доп.услуги (pill/toggle с золотым свечением), шаг 3 — площадь (stepper),
справа live-сводка «Ваш проект» (формат, площадь, что входит, срок, индикатор сложности, итог ₽ live),
CTA «Получить точную стоимость» (заглушка, без бэкенда). Микроанимации: мягкое свечение, плавный
пересчёт цены. Правила цен — entities/package/model/pricing.ts (один источник: ставки ₽/м², цены
доп.услуг, сроки). Замени стаб EstimateForm. Строго FSD, флюид, токены, reduced-motion, ui-ux-pro-max.
Чек-лист зелёный. НЕ мёржить.
```

## Фаза 6 — FAQ + Отзывы + Финальный CTA + Footer + Достижения + сборка
```
Ветка feat/tz-redesign. Прочитай docs/redesign/ROADMAP.md + CONTENT-MAP.md. ФАЗА 6 — FAQ + Отзывы +
Финальный CTA + Footer + Достижения + сборка главной. Рефы: docs/tz-refs/10-faq-reviews-footer.png и
01-home-overview.png (PDF 34–36). widgets/faq «Вопросы, которые задают чаще всего» (тёмная, glass-панели,
2 колонки, аккордеон). widgets/reviews «Что говорят наши клиенты» (тёмная): 1 большой отзыв (фото +
история что было/боялись/получили + фото проекта) + 2 коротких + рейтинг 4.9★ на 500+. widgets/contact-cta
«Давайте обсудим ваш проект» (тёмная): слева эмоция + 3 чекмарка + тёмные соцкнопки; справа форма (Имя/
Телефон/Площадь/Комментарий + «Обсудить проект» + 🔒) — отправка-заглушка; используется на главной и
/contact. Доработай widgets/footer (слоган, мини-навигация, «Документы», соцсети, тёмный). Оформи
AchievementsPage (блок доверия) и слинкуй из футера. Собери HomePage в полную воронку 1→12 с тональностями
и переходами. Строго FSD, флюид, токены, reduced-motion, ui-ux-pro-max. Чек-лист зелёный. НЕ мёржить.
```

## Фаза 7 — Производительность + доступность + QA + финал доков
```
Ветка feat/tz-redesign. Прочитай docs/redesign/ROADMAP.md + CONTENT-MAP.md. ФАЗА 7 — Производительность,
доступность, QA, финал доков. Производительность: пайплайн картинок (responsive sizes, WebP/AVIF,
заданные размеры → нет CLS, hero eager / остальное lazy), code-split тяжёлых виджетов (карта/калькулятор)
при необходимости, аудит очистки GSAP, прогон Lighthouse (цель 90+). Доступность: фокус-стейты, aria
(аккордеон/тоглы/формы), prefers-reduced-motion во всех анимациях, клавиатура, контраст на тёмном. e2e:
расширь Playwright — видимость каждой секции главной, интеракция калькулятора, валидация формы, навигация
блог/портфолио/услуги, локаль EN. Финализируй docs/redesign/CONTENT-MAP.md, обнови README.md/CLAUDE.md.
Полный чек-лист зелёный. Открой PR (черновик) feat/tz-redesign → main, НЕ мёржить.
```
