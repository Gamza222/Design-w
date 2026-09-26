import { spawn } from 'node:child_process';
import { emitKeypressEvents } from 'node:readline';

const repository = 'Gamza222/Design-w';
const recipients = [
  { username: 'designnoww', secret: 'LEAD_TELEGRAM_CHAT_ID' },
  { username: 'qwerty12345777', secret: 'LEAD_TELEGRAM_CHAT_ID_ADDITIONAL' },
];

class SetupError extends Error {}

function findRecipientChats(updates) {
  if (!Array.isArray(updates)) throw new SetupError('Telegram вернул неверный список сообщений.');
  const chats = new Map();

  for (const update of updates) {
    const message = update?.message ?? update?.edited_message;
    const chat = message?.chat;
    const sender = message?.from;
    if (
      chat?.type !== 'private' ||
      !Number.isSafeInteger(chat.id) ||
      chat.id <= 0 ||
      sender?.id !== chat.id ||
      sender?.is_bot !== false
    ) {
      continue;
    }
    const username = typeof chat.username === 'string' ? chat.username.toLowerCase() : '';
    if (!recipients.some((recipient) => recipient.username === username)) continue;
    if (sender.username?.toLowerCase() !== username) continue;
    const id = String(chat.id);
    if (chats.has(username) && chats.get(username) !== id) {
      throw new SetupError(`Для @${username} обнаружены разные ID. Проверьте владельца аккаунта.`);
    }
    chats.set(username, id);
  }

  if (new Set(chats.values()).size !== chats.size) {
    throw new SetupError('Два получателя должны иметь разные личные Telegram-чаты.');
  }
  return chats;
}

function readHidden(label) {
  return new Promise((resolve, reject) => {
    const input = process.stdin;
    const output = process.stdout;
    const wasRaw = input.isRaw;
    const characters = [];
    emitKeypressEvents(input);
    input.setRawMode(true);
    output.write(label);
    input.resume();

    const finish = (error) => {
      input.removeListener('keypress', onKeypress);
      input.setRawMode(Boolean(wasRaw));
      input.pause();
      output.write('\n');
      const value = characters.join('');
      characters.fill('');
      if (error) reject(error);
      else resolve(value);
    };
    const onKeypress = (text, key = {}) => {
      if (key.ctrl && (key.name === 'c' || key.name === 'd')) {
        finish(new SetupError('Настройка отменена.'));
      } else if (key.name === 'return' || key.name === 'enter') {
        finish();
      } else if (key.name === 'backspace') {
        if (characters.length > 0) {
          characters.pop();
          output.write('\b \b');
        }
      } else if (key.ctrl && key.name === 'u') {
        output.write('\b \b'.repeat(characters.length));
        characters.length = 0;
      } else if (!key.ctrl && !key.meta && text && /^[\x20-\x7e]+$/.test(text)) {
        characters.push(...text);
        output.write('*'.repeat(text.length));
      }
    };
    input.on('keypress', onKeypress);
  });
}

async function telegramRequest(token, method, payload = {}, request = fetch) {
  let response;
  let body;
  try {
    response = await request(`https://api.telegram.org/bot${token}/${method}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      redirect: 'error',
      signal: AbortSignal.timeout(15_000),
    });
    body = await response.json();
  } catch {
    // Ошибки fetch могут содержать URL с токеном: не выводим исходное исключение.
    throw new SetupError('Не удалось связаться с Telegram. Проверьте сеть и повторите настройку.');
  }
  if (!response.ok || body?.ok !== true) {
    if (response.status === 401 || body?.error_code === 401) {
      throw new SetupError('Telegram отклонил токен. Скопируйте актуальный токен из BotFather.');
    }
    if (response.status === 409 || body?.error_code === 409) {
      throw new SetupError(
        'Бот уже использует webhook или другой getUpdates. Остановите его обработчик и повторите настройку.',
      );
    }
    throw new SetupError('Telegram отклонил запрос. Повторите настройку позже.');
  }
  return body.result;
}

function runGh(args, input) {
  return new Promise((resolve, reject) => {
    // Содержимое секрета передаётся только через stdin; вывод gh намеренно скрыт.
    const child = spawn('gh', args, { stdio: ['pipe', 'ignore', 'ignore'] });
    child.on('error', () => reject(new SetupError('Не удалось запустить GitHub CLI (gh).')));
    child.on('close', (code) => resolve(code));
    child.stdin.on('error', () => {
      // При досрочном завершении gh результат обрабатывается через событие close.
    });
    child.stdin.end(input);
  });
}

async function main() {
  if (!process.stdin.isTTY || !process.stdout.isTTY) {
    throw new SetupError(
      'Запустите node scripts/setup-leads.mjs в обычном интерактивном терминале.',
    );
  }
  console.log(`Настройка доставки заявок — ${repository}`);
  console.log('Токен и пароль вводятся скрыто и сохраняются только в GitHub Secrets.');
  console.log('Понадобится пароль приложения Яндекса для dizain.seichas@yandex.ru.');
  if ((await runGh(['auth', 'status', '--hostname', 'github.com'])) !== 0) {
    throw new SetupError(
      'Сначала выполните gh auth login --hostname github.com и повторите команду.',
    );
  }

  const token = (await readHidden('Токен бота из BotFather: ')).trim();
  if (!/^\d+:[A-Za-z0-9_-]{30,}$/.test(token)) {
    throw new SetupError('Неверный формат токена. Скопируйте его целиком из BotFather.');
  }
  const bot = await telegramRequest(token, 'getMe');
  if (bot?.is_bot !== true || !/^[A-Za-z0-9_]{5,32}$/.test(bot.username ?? '')) {
    throw new SetupError('Telegram не подтвердил аккаунт бота. Проверьте токен.');
  }
  console.log(`Бот подтверждён: @${bot.username} — https://t.me/${bot.username}`);

  let chats;
  for (;;) {
    // Без offset: сообщения не подтверждаются и не удаляются из очереди Telegram.
    const updates = await telegramRequest(token, 'getUpdates', { limit: 100, timeout: 0 });
    chats = findRecipientChats(updates);
    const missing = recipients.filter(({ username }) => !chats.has(username));
    if (missing.length === 0) break;
    console.log(
      `${missing.map(({ username }) => `@${username}`).join(' и ')}: откройте https://t.me/${bot.username} и отправьте /start со своего аккаунта.`,
    );
    console.log(
      'Бот может не ответить — это нормально. Для обнаружения достаточно входящего /start.',
    );
    if (updates.length === 100) {
      throw new SetupError(
        'Очередь содержит 100 сообщений: нужные чаты могут быть за пределами ответа. Используйте нового бота или проверьте очередь вручную.',
      );
    }
    await readHidden('Когда оба пользователя отправят /start, нажмите Enter (Ctrl+C — выход): ');
  }
  console.log('Оба личных чата найдены: @designnoww и @qwerty12345777; ID разные.');

  const password = (
    await readHidden('Пароль приложения Яндекса для dizain.seichas@yandex.ru: ')
  ).replace(/\s/g, '');
  if (!password) throw new SetupError('Пароль приложения не может быть пустым.');

  const secrets = [
    ['LEAD_SMTP_PASSWORD', password],
    ['LEAD_TELEGRAM_BOT_TOKEN', token],
    ...recipients.map(({ username, secret }) => [secret, chats.get(username)]),
  ];
  for (const [name, value] of secrets) {
    const code = await runGh(['secret', 'set', name, '--repo', repository], value);
    if (code !== 0) {
      throw new SetupError(
        `Не удалось сохранить ${name}. Часть настроек могла сохраниться; проверьте права на ${repository} и повторите команду целиком.`,
      );
    }
    console.log(`Сохранён ${name}.`);
  }
  console.log('Готово: четыре секрета сохранены. Сайт автоматически этой командой не публикуется.');
  console.log(
    'После деплоя нужно проверить тестовую заявку в обоих Telegram-чатах и обеих почтах.',
  );
}

async function selfTest() {
  const { default: assert } = await import('node:assert/strict');
  const update = (username, id, overrides = {}) => ({
    message: {
      chat: { username, id, type: 'private', ...overrides },
      from: { username, id, is_bot: false },
    },
  });
  assert.deepEqual(
    [...findRecipientChats([update('DesignNoww', 1001), update('qwerty12345777', 1002)])],
    [
      ['designnoww', '1001'],
      ['qwerty12345777', '1002'],
    ],
  );
  assert.equal(findRecipientChats([update('designnoww', 1001, { type: 'group' })]).size, 0);
  assert.equal(findRecipientChats([update('designnoww_fake', 1001)]).size, 0);
  assert.equal(findRecipientChats([update('designnoww', Number.MAX_SAFE_INTEGER + 1)]).size, 0);
  assert.equal(findRecipientChats([update('designnoww', -1001)]).size, 0);
  assert.equal(
    findRecipientChats([update('designnoww', 1001), update('designnoww', 1001)]).size,
    1,
  );
  assert.throws(() => findRecipientChats([update('designnoww', 1001), update('designnoww', 1002)]));
  assert.throws(() =>
    findRecipientChats([update('designnoww', 1001), update('qwerty12345777', 1001)]),
  );
  assert.throws(() => findRecipientChats(null));
  const spoofed = update('unrelated', 1003);
  spoofed.message.text = '@designnoww';
  assert.equal(findRecipientChats([spoofed]).size, 0);
  const mismatched = update('designnoww', 1001);
  mismatched.message.from.id = 1002;
  assert.equal(findRecipientChats([mismatched]).size, 0);

  const sentinel = 'private-token-must-not-appear';
  await assert.rejects(
    telegramRequest(sentinel, 'getMe', {}, async () => {
      throw new Error(`https://api.telegram.org/bot${sentinel}/getMe`);
    }),
    (error) => error instanceof SetupError && !error.message.includes(sentinel),
  );
  const result = await telegramRequest(
    sentinel,
    'getUpdates',
    { limit: 100, timeout: 0 },
    async (_url, options) => {
      assert.equal(Object.hasOwn(JSON.parse(options.body), 'offset'), false);
      assert.equal(options.redirect, 'error');
      return { ok: true, json: async () => ({ ok: true, result: [] }) };
    },
  );
  assert.deepEqual(result, []);
  console.log(
    'Setup self-test: OK (получатели, подмена данных, повторные ID, отсутствие offset, скрытие токена).',
  );
}

try {
  if (process.argv.length === 3 && process.argv[2] === '--self-test') await selfTest();
  else if (process.argv.length === 2) await main();
  else throw new SetupError('Использование: node scripts/setup-leads.mjs [--self-test]');
} catch (error) {
  console.error(
    error instanceof SetupError
      ? error.message
      : 'Не удалось завершить настройку. Повторите команду.',
  );
  process.exitCode = 1;
}
