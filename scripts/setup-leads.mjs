import { spawn } from 'node:child_process';
import { emitKeypressEvents } from 'node:readline';

const repository = 'Gamza222/Design-w';
const recipientSecrets = ['LEAD_TELEGRAM_CHAT_ID', 'LEAD_TELEGRAM_CHAT_ID_ADDITIONAL'];

class SetupError extends Error {}

const normalizeUsername = (value) =>
  typeof value === 'string' && /^[A-Za-z0-9_]{5,32}$/.test(value) ? value.toLowerCase() : '';

function privateChats(updates, botUsername) {
  if (!Array.isArray(updates)) throw new SetupError('Telegram вернул неверный список сообщений.');
  const chats = new Map();
  for (const update of updates) {
    const message = update?.message;
    const chat = message?.chat;
    const sender = message?.from;
    const start =
      typeof message?.text === 'string'
        ? /^\/start(?:@([A-Za-z0-9_]+))?(?:\s|$)/.exec(message.text)
        : null;
    if (
      !start ||
      (start[1] && normalizeUsername(start[1]) !== normalizeUsername(botUsername)) ||
      message.forward_origin ||
      message.forward_date ||
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
    // Usernames are optional display labels, never recipient identifiers.
    const id = String(chat.id);
    const username = senderUsername || chatUsername;
    chats.set(id, { id, username });
  }
  return [...chats.values()];
}

function mergeRecipientChats(chats, incoming) {
  for (const chat of incoming) chats.set(chat.id, chat);
  return chats;
}

function validateRecipientChat(chat, id) {
  if (
    chat?.type !== 'private' ||
    !Number.isSafeInteger(chat.id) ||
    chat.id <= 0 ||
    String(chat.id) !== id
  ) {
    throw new SetupError(
      `Личный чат ID ${id} не подтверждён Telegram. Проверьте числовой ID получателя.`,
    );
  }
  return { id, username: normalizeUsername(chat.username) };
}

const describeChat = ({ id, username }) =>
  `${username ? `@${username}` : 'без @username'} — ID ${id}`;

function reportChats(updates, chats, log) {
  log(`Получено событий: ${updates.length}. Личных аккаунтов с /start: ${chats.size}; нужны два.`);
  if (chats.size) {
    for (const chat of chats.values()) log(`  ${describeChat(chat)}`);
  } else {
    log(
      'В ответе нет личных /start. Отправьте боту новое /start сейчас с каждого из двух аккаунтов.',
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
  log('Используем два аккаунта, отправивших /start. Привязки к конкретным @username нет.');
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
      allowed_updates: ['message'],
    });
    mergeRecipientChats(chats, privateChats(updates, bot.username));
    reportChats(updates, chats, log);
    if (updates.length === 100) {
      log(
        'Очередь содержит не менее 100 событий; список может быть неполным. Выберите два известных ID вручную. Мастер не удаляет события.',
      );
    }
    if (chats.size > 2 || updates.length === 100) {
      if (chats.size > 2)
        log('Найдено больше двух аккаунтов. Автоматически выбирать получателей небезопасно.');
      manual = true;
      break;
    }
    if (chats.size === 2) break;
    log(
      `Откройте https://t.me/${bot.username} и отправьте НОВОЕ /start со второго аккаунта${chats.size ? '' : ' и с первого'}.`,
    );
    log('Отсутствие ответа бота на /start нормально: сейчас проверяем входящее сообщение.');
    if (attempts >= 5) {
      throw new SetupError(
        'После 5 проверок не найдены два личных /start. Убедитесь, что оба аккаунта пишут именно этому боту и нет второго обработчика getUpdates. Или повторите мастер с ручным вводом ID (id). Токен никуда не отправляйте.',
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
  let selected = [...chats.keys()];
  if (manual) {
    selected = [];
    for (let index = 0; index < recipientSecrets.length; index++) {
      const id = (
        await prompt(`Числовой ID личного чата получателя ${index + 1} (не @username): `)
      ).trim();
      if (!/^[1-9]\d*$/.test(id) || !Number.isSafeInteger(Number(id))) {
        throw new SetupError('Личный chat ID должен быть положительным целым числом.');
      }
      if (selected.includes(id)) {
        throw new SetupError('Два получателя должны иметь разные личные Telegram-чаты.');
      }
      selected.push(id);
    }
  }
  const recipients = [];
  for (const id of selected) {
    const chat = validateRecipientChat(await api(token, 'getChat', { chat_id: id }), id);
    recipients.push(chat);
    log(`✓ Подтверждён получатель: ${describeChat(chat)}.`);
  }
  log('Оба личных чата подтверждены Telegram, ID разные.');
  log('Получатели сохраняются по ID. Новые /start после настройки не добавят других получателей.');

  const secrets = [
    ['LEAD_TELEGRAM_BOT_TOKEN', token],
    ...recipients.map(({ id }, index) => [recipientSecrets[index], id]),
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
    for (const chat of recipients) {
      const { id } = chat;
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
      log(`✓ Проверочное сообщение принято Telegram: ${describeChat(chat)}.`);
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
      text: '/start',
    },
  });
  assert.deepEqual(privateChats([update('First_person', 1001), update(undefined, 1002)]), [
    { id: '1001', username: 'first_person' },
    { id: '1002', username: '' },
  ]);
  assert.equal(privateChats([update('first_person', 1001, { type: 'group' })]).length, 0);
  assert.equal(privateChats([update('first_person', Number.MAX_SAFE_INTEGER + 1)]).length, 0);
  assert.equal(privateChats([update('first_person', -1001)]).length, 0);
  assert.equal(
    privateChats([update('first_person', 1001), update('renamed_person', 1001)]).length,
    1,
  );
  // A username can change owners; different verified sender IDs remain distinct.
  assert.equal(privateChats([update('same_name', 1001), update('same_name', 1002)]).length, 2);
  assert.throws(() => privateChats(null));
  const spoofed = update('unrelated', 1003);
  for (const text of ['@first_person', 'hello /start', '/starter', '/start@other_bot']) {
    spoofed.message.text = text;
    assert.equal(privateChats([spoofed], 'designseichas_bot').length, 0);
  }
  spoofed.message.text = '/start@Designseichas_bot campaign';
  assert.equal(privateChats([spoofed], 'designseichas_bot').length, 1);
  spoofed.message.forward_origin = { type: 'user' };
  assert.equal(privateChats([spoofed], 'designseichas_bot').length, 0);
  const edited = update('first_person', 1001);
  assert.equal(privateChats([{ edited_message: edited.message }]).length, 0);
  const mismatched = update('first_person', 1001);
  mismatched.message.from.id = 1002;
  assert.equal(privateChats([mismatched]).length, 0);
  const botSender = update('another_bot', 1001);
  botSender.message.from.is_bot = true;
  assert.equal(privateChats([botSender]).length, 0);
  const optionalChatUsername = update('first_person', 1001);
  delete optionalChatUsername.message.chat.username;
  assert.equal(privateChats([optionalChatUsername])[0].username, 'first_person');
  const optionalSenderUsername = update('first_person', 1001);
  delete optionalSenderUsername.message.from.username;
  assert.equal(privateChats([optionalSenderUsername])[0].username, 'first_person');
  const conflictingNames = update('first_person', 1001);
  conflictingNames.message.from.username = 'unrelated';
  assert.equal(privateChats([conflictingNames])[0].id, '1001');
  assert.equal(
    validateRecipientChat({ type: 'private', id: 1001, username: 'renamed_person' }, '1001')
      .username,
    'renamed_person',
  );
  assert.throws(() => validateRecipientChat({ type: 'private', id: 1002 }, '1001'));
  assert.throws(() => validateRecipientChat({ type: 'group', id: 1001 }, '1001'));
  assert.throws(() => validateRecipientChat({ type: 'private', id: '1001' }, '1001'));
  assert.equal(
    mergeRecipientChats(new Map([['1001', { id: '1001', username: 'first_person' }]]), [
      { id: '1001', username: 'renamed_person' },
    ]).size,
    1,
  );

  // Exercise the actual interactive flow with fake I/O: never touch Telegram/GitHub.
  const fakeToken = `123456:${'x'.repeat(32)}`;
  const scenario = (batches, answers = [], webhook = false, chatOverrides = {}) => {
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
            assert.deepEqual(payload.allowed_updates, ['message']);
            assert.equal(Object.hasOwn(payload, 'offset'), false);
            return batches[Math.min(batch++, batches.length - 1)] ?? [];
          }
          if (method === 'getChat')
            return {
              id: Number(payload.chat_id),
              type: 'private',
              username: payload.chat_id === '1001' ? 'renamed_person' : undefined,
              ...chatOverrides,
            };
          if (method === 'sendMessage')
            return { message_id: 5, chat: { id: Number(payload.chat_id) } };
          assert.fail(`Unexpected mutation: ${method}`);
        },
      });
    return { run, calls, saved, logs };
  };
  const exactTwo = scenario([[update('first_person', 1001), update(undefined, 1002)]]);
  await exactTwo.run();
  assert.deepEqual(exactTwo.saved, [
    ['LEAD_TELEGRAM_BOT_TOKEN', fakeToken],
    ['LEAD_TELEGRAM_CHAT_ID', '1001'],
    ['LEAD_TELEGRAM_CHAT_ID_ADDITIONAL', '1002'],
  ]);
  const foundInSeparatePolls = scenario([[update(undefined, 1002)], [optionalChatUsername]]);
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
  assert.ok(
    foundInSeparatePolls.logs.some((line) =>
      line.includes('✓ Подтверждён получатель: без @username — ID 1002'),
    ),
  );

  const unknownUpdate = update('unrelated', 1003);
  unknownUpdate.message.text = 'private message content must never appear';
  const boundedMissing = scenario([[unknownUpdate]]);
  await assert.rejects(boundedMissing.run(), /После 5 проверок/);
  assert.equal(boundedMissing.calls.filter(({ method }) => method === 'getUpdates').length, 5);
  assert.equal(boundedMissing.saved.length, 0);
  assert.ok(!boundedMissing.logs.join('\n').includes(unknownUpdate.message.text));

  const duplicateOnly = scenario([[update('first_person', 1001), update('renamed_person', 1001)]]);
  await assert.rejects(duplicateOnly.run(), /После 5 проверок/);
  assert.equal(duplicateOnly.saved.length, 0);

  const tooMany = scenario(
    [[update('first_person', 1001), update(undefined, 1002), update('third_person', 1003)]],
    ['1003', '1002'],
  );
  await tooMany.run();
  assert.deepEqual(
    tooMany.saved.slice(1).map(([, id]) => id),
    ['1003', '1002'],
  );
  const noSelection = scenario([
    [update('first_person', 1001), update(undefined, 1002), update('third_person', 1003)],
  ]);
  await assert.rejects(noSelection.run(), /положительным целым/);
  assert.equal(noSelection.saved.length, 0);
  const fullQueue = scenario(
    [Array.from({ length: 100 }, (_, index) => update(undefined, index % 2 ? 1001 : 1002))],
    ['1001', '1002'],
  );
  await fullQueue.run();
  assert.equal(fullQueue.saved.length, 3);
  assert.ok(fullQueue.logs.some((line) => line.includes('список может быть неполным')));

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
  const manualAfterOne = scenario([[update('first_person', 1001)]], ['id', '1002', '1001']);
  await manualAfterOne.run();
  assert.deepEqual(
    manualAfterOne.saved.slice(1).map(([, id]) => id),
    ['1002', '1001'],
  );
  for (const chatOverrides of [{ type: 'group' }, { id: 9999 }]) {
    const invalidChat = scenario([], ['id', '1001', '1002'], true, chatOverrides);
    await assert.rejects(invalidChat.run(), /не подтверждён/);
    assert.equal(invalidChat.saved.length, 0);
  }

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
    'Setup self-test: OK (два /start-аккаунта по ID, любые username, дедупликация, защита от пересланных сообщений, ручной выбор при >2, проверка Telegram, лимит повторов, 3 секрета без почты, тестовые сообщения только после TEST, защита токена).',
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
