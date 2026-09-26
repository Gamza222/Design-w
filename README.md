# ДизайнСейчас

Мультиязычный имиджевый сайт студии дизайна интерьера: услуги, портфолио, блог. Быстрый,
SEO-friendly, статический (SSG), контент пополняется через MDX.

## Стек

Vite · React 19 · TypeScript (strict) · React Router v7 (framework mode, `ssr:false` + prerender →
статика) · react-i18next (RU + EN) · MDX · SCSS Modules + CSS-переменные · GSAP/ScrollSmoother ·
Vitest + Playwright · ESLint/Steiger/Stylelint/Prettier · деплой на REG.RU.

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
npm run e2e          # Playwright: Chromium + WebKit (поднимает build + preview сам)
php tests/backend/lead-test.php # изолированные тесты доставки, PHP 7.4+
node --test scripts/generate-lead-config.test.mjs # проверка deploy-конфига
node scripts/setup-leads.mjs --self-test # проверка мастера настройки без сети и секретов
```

## Контент

- Блог: `content/blog/{ru,en}/<slug>.mdx`
- Портфолио: `content/portfolio/{ru,en}/<slug>.mdx`

После добавления MDX нужен `npm run build` (статическая сборка, без on-demand).

Фотографии — только реальные проекты студии. Веб-версии WebP создаются из сохранённых JPEG
без изменения кадра и разрешения: `node scripts/optimize-real-images.mjs` (нужен `cwebp`).
JPEG также сохраняются для социальных превью. HTML, CSS и JavaScript сжимаются на хостинге
через `mod_deflate`; локальный preview использует такое же gzip-сжатие.

## Деплой

Production — статический хостинг REG.RU, корень сайта `/www/designseichas.ru`. Workflow `CI`
после успешных проверок собирает проект и синхронизирует содержимое `build/client/` по FTPS при
push в `main`.

### Доставка заявок

Формы отправляют заявку на `POST /api/lead.php`. Обработчик разворачивается вместе со статикой на
REG.RU с PHP 7.4+ и исходящим доступом к SMTP Яндекса (TLS, порт 465) и Telegram API (HTTPS).
Одна заявка отправляется всем четырём получателям:

- почта `dizain.seichas@yandex.ru`;
- почта `gamzaweb@gmail.com`;
- Telegram `@designnoww`;
- Telegram `@qwerty12345777`.

Оба письма отправляются от `dizain.seichas@yandex.ru`; доступ к Gmail не нужен. Успех формы
показывается только после принятия обоих писем SMTP-сервером и подтверждения двух сообщений
Telegram. Это подтверждает принятие сервисами, но не попадание письма во «Входящие»: при первом
тесте нужно проверить также «Спам» у обоих адресатов.

Состояние хранится отдельно для каждого получателя: повтор неизменённой заявки с тем же ID
досылает только неподтверждённые отправления. ID привязан к содержимому заявки; изменённые данные
с прежним ID отклоняются с 409. Состояние и ограничение частоты запросов хранятся в закрытом
каталоге PHP `sys_get_temp_dir()`, без текста заявки. Очистка временных файлов хостингом сбрасывает
историю повторов; гарантии «ровно одна доставка» при обрыве связи после принятия сервисом нет.

Перед production-деплоем добавьте в GitHub Actions четыре repository secret
([настройки репозитория](https://github.com/Gamza222/Design-w/settings/secrets/actions)):

- `LEAD_SMTP_PASSWORD` — отдельный пароль приложения Яндекса для
  `dizain.seichas@yandex.ru`, не основной пароль;
- `LEAD_TELEGRAM_BOT_TOKEN` — токен бота от BotFather;
- `LEAD_TELEGRAM_CHAT_ID` — числовой ID чата пользователя `@designnoww` с этим ботом;
- `LEAD_TELEGRAM_CHAT_ID_ADDITIONAL` — числовой ID чата пользователя `@qwerty12345777` с этим ботом.

Оба пользователя должны открыть созданного бота и нажать «Запустить» (`/start`). После этого ID
можно получить из `message.chat.id` в ответе метода `getUpdates` этого бота. Имена личных аккаунтов
`@…` не заменяют chat ID. Для канала/группы используйте его числовой ID и добавьте бота с правом
отправки. Два ID должны быть разными. Не отправляйте токен и пароль в чат или Git: добавляйте их
напрямую в GitHub Secrets. Инструкции:
[Яндекс SMTP и пароль приложения](https://www.yandex.ru/support/yandex-360/customers/mail/ru/mail-clients/others),
[Telegram Bot API](https://core.telegram.org/bots/api#getupdates).

Для личных аккаунтов `@designnoww` и `@qwerty12345777` есть локальный мастер настройки. В обычном
терминале из папки проекта выполните:

```bash
node scripts/setup-leads.mjs
```

Нужны Node.js 22+ и GitHub CLI (`gh`) с доступом к настройкам репозитория. Если вход ещё не
выполнен, мастер предложит `gh auth login --hostname github.com`. Введите токен созданного бота
из BotFather и отдельный пароль приложения Яндекса по запросу мастера; ввод скрыт звёздочками.
Мастер проверит бота, предложит обоим аккаунтам отправить `/start`, найдёт их числовые ID и
сохранит четыре секрета именно в `Gamza222/Design-w`. При необходимости существующие значения
будут заменены. Он читает `getUpdates` без `offset`, не удаляет сообщения из очереди и не меняет
webhook. Секреты передаются GitHub CLI через stdin, не записываются в локальные файлы и не
появляются в аргументах команд или выводе. При ошибке сохранения повторите настройку целиком.
Команда не запускает деплой; проверка фактической доставки выполняется после публикации.

Во время deploy workflow создаёт `build/client/api/.lead-config.php`; файл игнорируется Git и
закрыт от HTTP-доступа правилами `public/api/.htaccess`. Без всех четырёх значений deploy намеренно
останавливается, чтобы не публиковать форму, которая теряет заявки.

До загрузки файлов workflow также проверяет SMTP-авторизацию и доступ бота к обоим чатам
через `scripts/check-lead-delivery.php`, без отправки писем или Telegram-сообщений.

После настройки отправьте тестовую заявку с сайта и подтвердите её получение в обеих почтах и
обоих чатах. Автоматические тесты не отправляют настоящие письма или сообщения.

Перед первым деплоем в GitHub необходимо добавить secret `DEPLOY_FTP_PASSWORD`, variables
`DEPLOY_USER`, `DEPLOY_HOST`, `DEPLOY_PORT`, `DEPLOY_PATH`, `DEPLOY_FTP_CERT_SHA1`, затем включить
`DEPLOY_ENABLED=true`. Соединение требует FTP с явным TLS; `.well-known` сохраняется при
синхронизации для продления SSL-сертификата. Самоподписанный серверный сертификат принимается
только при совпадении закреплённого отпечатка.

---

Внутренняя документация для ИИ-агента и подробные правила — в [CLAUDE.md](CLAUDE.md).
