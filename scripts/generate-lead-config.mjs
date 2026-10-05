import { chmod, mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const required = {
  telegramBotToken: process.env.LEAD_TELEGRAM_BOT_TOKEN,
  telegramChatId: process.env.LEAD_TELEGRAM_CHAT_ID,
  telegramAdditionalChatId: process.env.LEAD_TELEGRAM_CHAT_ID_ADDITIONAL,
};

const missing = Object.entries(required)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missing.length > 0) {
  throw new Error(`Missing lead delivery configuration: ${missing.join(', ')}`);
}

if (!/^\d+:[A-Za-z0-9_-]{30,}$/.test(required.telegramBotToken)) {
  throw new Error('LEAD_TELEGRAM_BOT_TOKEN has an invalid format');
}
for (const key of ['telegramChatId', 'telegramAdditionalChatId']) {
  if (!/^-?[1-9]\d{0,19}$/.test(required[key])) {
    throw new Error(`${key} must be a numeric Telegram chat ID, not a personal username`);
  }
}
if (required.telegramChatId === required.telegramAdditionalChatId) {
  throw new Error('The two Telegram recipients must have distinct chat IDs');
}

const stateDirectory = process.env.LEAD_STATE_DIR ?? '';
if (
  stateDirectory !== '' &&
  (!stateDirectory.startsWith('/') ||
    stateDirectory === '/' ||
    [...stateDirectory].some((character) => character.charCodeAt(0) < 32) ||
    stateDirectory.includes('\\') ||
    stateDirectory.split('/').some((part) => part === '.' || part === '..') ||
    /^\/(?:private\/)?(?:tmp|var\/tmp)(?:\/|$)/.test(stateDirectory))
) {
  throw new Error('LEAD_STATE_DIR must be an absolute persistent directory outside the web root');
}

const target = resolve(process.argv[2] ?? 'build/client/api/.lead-config.php');
const encode = (value) => Buffer.from(value, 'utf8').toString('base64');
const php = `<?php

if (realpath($_SERVER['SCRIPT_FILENAME'] ?? '') === __FILE__) {
    http_response_code(404);
    exit;
}

return [
    'telegramBotToken' => base64_decode('${encode(required.telegramBotToken)}', true),
    'telegramChatId' => base64_decode('${encode(required.telegramChatId)}', true),
    'telegramAdditionalChatId' => base64_decode('${encode(required.telegramAdditionalChatId)}', true),
    'stateDirectory' => base64_decode('${encode(stateDirectory)}', true),
];
`;
await mkdir(dirname(target), { recursive: true });
await writeFile(target, php, { encoding: 'utf8', mode: 0o600 });
await chmod(target, 0o600);
console.log(`Lead delivery configuration generated at ${target}`);
