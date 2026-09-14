import { chmod, mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const required = {
  smtpPassword: process.env.LEAD_SMTP_PASSWORD,
  telegramBotToken: process.env.LEAD_TELEGRAM_BOT_TOKEN,
  telegramChatId: process.env.LEAD_TELEGRAM_CHAT_ID,
};

const missing = Object.entries(required)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missing.length > 0) {
  throw new Error(`Missing lead delivery configuration: ${missing.join(', ')}`);
}

const target = resolve(process.argv[2] ?? 'build/client/api/.lead-config.php');
const encode = (value) => Buffer.from(value, 'utf8').toString('base64');
const php = `<?php

if (realpath($_SERVER['SCRIPT_FILENAME'] ?? '') === __FILE__) {
    http_response_code(404);
    exit;
}

return [
    'smtpPassword' => base64_decode('${encode(required.smtpPassword)}', true),
    'telegramBotToken' => base64_decode('${encode(required.telegramBotToken)}', true),
    'telegramChatId' => base64_decode('${encode(required.telegramChatId)}', true),
];
`;
await mkdir(dirname(target), { recursive: true });
await writeFile(target, php, { encoding: 'utf8', mode: 0o600 });
await chmod(target, 0o600);
console.log(`Lead delivery configuration generated at ${target}`);
