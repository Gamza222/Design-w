# ДизайнСейчас

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

Production — статический хостинг REG.RU, корень сайта `/www/designseichas.ru`. Workflow `CI`
после успешных проверок собирает проект и синхронизирует содержимое `build/client/` по FTPS при
push в `main`.

### Доставка заявок

Формы отправляют заявку на `POST /api/lead.php`. Обработчик разворачивается вместе со статикой на
REG.RU, отправляет письмо через SMTP Яндекса на `dizain.seichas@yandex.ru` и ту же заявку через
Telegram Bot API. Успех показывается пользователю только после подтверждения обоих каналов; повтор
запроса с тем же идентификатором досылает только ранее упавший канал.

Перед production-деплоем добавьте в GitHub Actions три repository secret:

- `LEAD_SMTP_PASSWORD` — отдельный пароль приложения Яндекса для
  `dizain.seichas@yandex.ru`, не основной пароль;
- `LEAD_TELEGRAM_BOT_TOKEN` — токен бота от BotFather;
- `LEAD_TELEGRAM_CHAT_ID` — числовой ID личного чата после `/start`, либо `@channel_name` для
  канала, куда бот добавлен с правом публикации.

Во время deploy workflow создаёт `build/client/api/.lead-config.php`; файл игнорируется Git и
закрыт от HTTP-доступа правилами `public/api/.htaccess`. Без всех трёх значений deploy намеренно
останавливается, чтобы не публиковать форму, которая теряет заявки.

Перед первым деплоем в GitHub необходимо добавить secret `DEPLOY_FTP_PASSWORD`, variables
`DEPLOY_USER`, `DEPLOY_HOST`, `DEPLOY_PORT`, `DEPLOY_PATH`, `DEPLOY_FTP_CERT_SHA1`, затем включить
`DEPLOY_ENABLED=true`. Соединение требует FTP с явным TLS; `.well-known` сохраняется при
синхронизации для продления SSL-сертификата. Самоподписанный серверный сертификат принимается
только при совпадении закреплённого отпечатка.

---

Внутренняя документация для ИИ-агента и подробные правила — в [CLAUDE.md](CLAUDE.md).
