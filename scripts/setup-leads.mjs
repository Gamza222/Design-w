import { spawn } from 'node:child_process';
import { emitKeypressEvents } from 'node:readline';

const repository = 'Gamza222/Design-w';
const recipients = [
  { username: 'designnoww', secret: 'LEAD_TELEGRAM_CHAT_ID' },
  { username: 'qwerty12345777', secret: 'LEAD_TELEGRAM_CHAT_ID_ADDITIONAL' },
];

class SetupError extends Error {}

const normalizeUsername = (value) =>
  typeof value === 'string' && /^[A-Za-z0-9_]{5,32}$/.test(value) ? value.toLowerCase() : '';

function privateChats(updates) {
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
    const chatUsername = normalizeUsername(chat.username);
    const senderUsername = normalizeUsername(sender.username);
    // Both fields are optional in the Bot API. Either can identify the verified
    // sender; text/forwarded names must never determine the destination.
    if (chatUsername && senderUsername && chatUsername !== senderUsername) continue;
    const id = String(chat.id);
    const username = senderUsername || chatUsername;
    chats.set(`${id}:${username}`, { id, username });
  }
  return [...chats.values()];
}

function mergeRecipientChats(chats, incoming) {
  for (const [username, id] of incoming) {
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

function findRecipientChats(updates) {
  const matches = privateChats(updates)
    .filter(({ username }) => recipients.some((recipient) => recipient.username === username))
    .map(({ username, id }) => [username, id]);
  return mergeRecipientChats(new Map(), matches);
}

function validateRecipientChat(chat, username, id) {
  if (
    chat?.type !== 'private' ||
    String(chat.id) !== id ||
    normalizeUsername(chat.username) !== username
  ) {
    const actual = normalizeUsername(chat?.username);
    throw new SetupError(
      `ID для @${username} не подтверждён${actual ? `: Telegram вернул @${actual}` : ''}. Проверьте именно имя пользователя в настройках Telegram, не отображаемое имя.`,
    );
  }
}

function reportChats(updates, chats, log) {
  log(
    `Получено событий: ${updates.length}. Найдено получателей: ${chats.size}/${recipients.length}.`,
  );
  for (const { username } of recipients) {
    log(
      chats.has(username)
        ? `✓ @${username}: чат найден, ID ${chats.get(username)}.`
        : `— @${username}: пока не найден.`,
    );
  }
  const observed = privateChats(updates);
  if (observed.length) {
    log('Личные чаты в ответе Telegram (тексты сообщений не выводятся):');
    for (const { id, username } of observed)
      log(`  ${username ? `@${username}` : 'без @username'} — ID ${id}`);
    log(
      'Если нужного @username нет в списке, проверьте выбранный аккаунт Telegram и его имя пользователя.',
    );
  } else {
    log(
      'В ответе нет личных сообщений. Отправьте новое сообщение боту сейчас, а не только нажмите старую кнопку «Запустить».',
    );
    log(
      'Старые события хранятся не дольше 24 часов; другой запущенный обработчик тоже мог забрать их.',
    );
  }
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
    if (response.status === 403 || body?.error_code === 403) {
      throw new SetupError(
        'Telegram запретил доступ к чату. Разблокируйте бота и отправьте ему /start из нужного аккаунта.',
      );
    }
    throw new SetupError(
      `Telegram отклонил ${method}. Проверьте ID чата и отправьте боту новое /start.`,
    );
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

async function main({
  prompt = readHidden,
  api = telegramRequest,
  github = runGh,
  log = console.log,
  interactive = process.stdin.isTTY && process.stdout.isTTY,
} = {}) {
  if (!interactive) {
    throw new SetupError(
      'Запустите node scripts/setup-leads.mjs в обычном интерактивном терминале.',
    );
  }
  log(`Настройка Telegram-заявок — ${repository}`);
  log('Почта отключена. Нужен только токен бота; ввод скрыт, хранение — GitHub Secrets.');
  log(
    'В production заявки отправляет PHP на том же сервере, где сайт. Держать этот терминал открытым не нужно.',
  );
  if ((await github(['auth', 'status', '--hostname', 'github.com'])) !== 0) {
    throw new SetupError(
      'Сначала выполните gh auth login --hostname github.com и повторите команду.',
    );
  }

  const token = (await prompt('Токен бота из BotFather: ')).trim();
  if (!/^\d+:[A-Za-z0-9_-]{30,}$/.test(token)) {
    throw new SetupError('Неверный формат токена. Скопируйте его целиком из BotFather.');
  }
  const bot = await api(token, 'getMe');
  if (bot?.is_bot !== true || !/^[A-Za-z0-9_]{5,32}$/.test(bot.username ?? '')) {
    throw new SetupError('Telegram не подтвердил аккаунт бота. Проверьте токен.');
  }
  log(`Бот подтверждён: @${bot.username} — https://t.me/${bot.username}`);
  const webhook = await api(token, 'getWebhookInfo');
  let manual = Boolean(webhook?.url);
  if (manual) {
    log(
      'У бота уже настроен webhook: он получает сообщения вместо мастера. Мастер его не отключает.',
    );
    if (
      (await prompt('Если знаете числовые ID обоих чатов, введите id; иначе Ctrl+C: '))
        .trim()
        .toLowerCase() !== 'id'
    ) {
      throw new SetupError('Нужны ID из действующего обработчика бота. Webhook не изменён.');
    }
  }

  const chats = new Map();
  let attempts = 0;
  while (!manual) {
    attempts++;
    // Explicit subscription also repairs a previously saved filter excluding
    // messages. It applies to NEW updates. No offset: nothing is acknowledged.
    const updates = await api(token, 'getUpdates', {
      limit: 100,
      timeout: 0,
      allowed_updates: ['message', 'edited_message'],
    });
    mergeRecipientChats(chats, findRecipientChats(updates));
    reportChats(updates, chats, log);
    const missing = recipients.filter(({ username }) => !chats.has(username));
    if (missing.length === 0) break;
    log(
      `${missing.map(({ username }) => `@${username}`).join(' и ')}: откройте https://t.me/${bot.username} и отправьте НОВОЕ /start именно сейчас.`,
    );
    log('Отсутствие ответа бота на /start нормально: сейчас проверяем входящее сообщение.');
    if (updates.length === 100) {
      log(
        'Показаны первые 100 событий очереди; мастер не удаляет их. Для уже известных ID используйте id.',
      );
    }
    if (attempts >= 5) {
      throw new SetupError(
        'После 5 проверок чат не найден. Сверьте @username в диагностике выше, убедитесь, что пишете именно этому боту и нет второго обработчика getUpdates. Токен никуда не отправляйте.',
      );
    }
    manual =
      (
        await prompt(
          `Проверка ${attempts}/5: Enter — проверить ещё раз; id — ввести известные ID; Ctrl+C — выход: `,
        )
      )
        .trim()
        .toLowerCase() === 'id';
  }
  if (manual) {
    for (const { username } of recipients) {
      if (chats.has(username)) continue;
      const id = (await prompt(`Числовой ID личного чата @${username} (не @username): `)).trim();
      if (!/^[1-9]\d*$/.test(id) || !Number.isSafeInteger(Number(id))) {
        throw new SetupError('Личный chat ID должен быть положительным целым числом.');
      }
      mergeRecipientChats(chats, [[username, id]]);
    }
  }
  for (const { username } of recipients) {
    const id = chats.get(username);
    validateRecipientChat(await api(token, 'getChat', { chat_id: id }), username, id);
  }
  log('Оба личных чата подтверждены Telegram, ID разные.');

  const secrets = [
    ['LEAD_TELEGRAM_BOT_TOKEN', token],
    ...recipients.map(({ username, secret }) => [secret, chats.get(username)]),
  ];
  for (const [name, value] of secrets) {
    const code = await github(['secret', 'set', name, '--repo', repository], value);
    if (code !== 0) {
      throw new SetupError(
        `Не удалось сохранить ${name}. Часть настроек могла сохраниться; проверьте права на ${repository} и повторите команду целиком.`,
      );
    }
    log(`Сохранён ${name}.`);
  }
  log('Готово: три секрета сохранены. Сайт автоматически этой командой не публикуется.');
  if (
    (
      await prompt(
        'Отправить по одному проверочному сообщению в оба чата? Введите TEST, Enter — пропустить: ',
      )
    )
      .trim()
      .toUpperCase() === 'TEST'
  ) {
    for (const { username } of recipients) {
      const id = chats.get(username);
      const sent = await api(token, 'sendMessage', {
        chat_id: id,
        text: 'ДизайнСейчас — проверка подключения. Этот чат настроен для заявок с designseichas.ru. Это тест из мастера настройки, не заявка клиента.',
        link_preview_options: { is_disabled: true },
      });
      if (!Number.isSafeInteger(sent?.message_id) || String(sent?.chat?.id) !== id) {
        throw new SetupError(
          'Настройки сохранены, но Telegram не подтвердил доставку проверочного сообщения.',
        );
      }
      log(`✓ Проверочное сообщение принято Telegram для @${username}.`);
    }
  }
  log(
    'После публикации отдельно проверим заявку с сайта: локальный тест не проверяет сеть хостинга.',
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
  const optionalChatUsername = update('designnoww', 1001);
  delete optionalChatUsername.message.chat.username;
  assert.equal(findRecipientChats([optionalChatUsername]).get('designnoww'), '1001');
  const optionalSenderUsername = update('designnoww', 1001);
  delete optionalSenderUsername.message.from.username;
  assert.equal(findRecipientChats([optionalSenderUsername]).get('designnoww'), '1001');
  const conflictingNames = update('designnoww', 1001);
  conflictingNames.message.from.username = 'unrelated';
  assert.equal(findRecipientChats([conflictingNames]).size, 0);
  assert.throws(() =>
    validateRecipientChat(
      { type: 'private', id: 1001, username: 'unrelated' },
      'designnoww',
      '1001',
    ),
  );
  assert.throws(() =>
    mergeRecipientChats(new Map([['designnoww', '1001']]), [['designnoww', '1002']]),
  );

  // Exercise the actual interactive flow with fake I/O: never touch Telegram/GitHub.
  const fakeToken = `123456:${'x'.repeat(32)}`;
  const scenario = (batches, answers = [], webhook = false) => {
    const calls = [];
    const saved = [];
    const logs = [];
    let batch = 0;
    const run = () =>
      main({
        interactive: true,
        log: (line) => logs.push(line),
        prompt: async (label) => (label.startsWith('Токен') ? fakeToken : (answers.shift() ?? '')),
        github: async (args, value) => {
          if (args[0] === 'secret') saved.push([args[2], value]);
          return 0;
        },
        api: async (token, method, payload) => {
          assert.equal(token, fakeToken);
          calls.push({ method, payload });
          if (method === 'getMe') return { is_bot: true, username: 'designseichas_bot' };
          if (method === 'getWebhookInfo')
            return { url: webhook ? 'https://example.invalid/private' : '' };
          if (method === 'getUpdates') {
            assert.deepEqual(payload.allowed_updates, ['message', 'edited_message']);
            assert.equal(Object.hasOwn(payload, 'offset'), false);
            return batches[Math.min(batch++, batches.length - 1)] ?? [];
          }
          if (method === 'getChat')
            return {
              id: Number(payload.chat_id),
              type: 'private',
              username: payload.chat_id === '1001' ? 'designnoww' : 'qwerty12345777',
            };
          if (method === 'sendMessage')
            return { message_id: 5, chat: { id: Number(payload.chat_id) } };
          assert.fail(`Unexpected mutation: ${method}`);
        },
      });
    return { run, calls, saved, logs };
  };
  const foundInSeparatePolls = scenario([[update('qwerty12345777', 1002)], [optionalChatUsername]]);
  await foundInSeparatePolls.run();
  assert.deepEqual(
    foundInSeparatePolls.saved.map(([name]) => name),
    ['LEAD_TELEGRAM_BOT_TOKEN', 'LEAD_TELEGRAM_CHAT_ID', 'LEAD_TELEGRAM_CHAT_ID_ADDITIONAL'],
  );
  assert.equal(
    foundInSeparatePolls.calls.filter(({ method }) => method === 'sendMessage').length,
    0,
  );
  assert.ok(!foundInSeparatePolls.logs.join('\n').includes(fakeToken));
  assert.ok(foundInSeparatePolls.logs.some((line) => line.includes('✓ @qwerty12345777')));

  const unknownUpdate = update('unrelated', 1003);
  unknownUpdate.message.text = 'private message content must never appear';
  const boundedMissing = scenario([[unknownUpdate]]);
  await assert.rejects(boundedMissing.run(), /После 5 проверок/);
  assert.equal(boundedMissing.calls.filter(({ method }) => method === 'getUpdates').length, 5);
  assert.equal(boundedMissing.saved.length, 0);
  assert.ok(!boundedMissing.logs.join('\n').includes(unknownUpdate.message.text));

  const manualWebhook = scenario([], ['id', '1001', '1002', 'TEST'], true);
  await manualWebhook.run();
  assert.equal(manualWebhook.calls.filter(({ method }) => method === 'getUpdates').length, 0);
  assert.deepEqual(
    manualWebhook.calls
      .filter(({ method }) => method === 'sendMessage')
      .map(({ payload }) => payload.chat_id),
    ['1001', '1002'],
  );
  const duplicateManual = scenario([], ['id', '1001', '1001'], true);
  await assert.rejects(duplicateManual.run(), /разные личные/);
  assert.equal(duplicateManual.saved.length, 0);

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
    'Setup self-test: OK (оба чата, необязательные username, накопление найденных ID, диагностика, лимит повторов, ручной ввод, 3 секрета без почты, тестовые сообщения только после TEST, защита токена).',
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
