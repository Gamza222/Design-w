import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { copyFile, mkdir, mkdtemp, rm } from 'node:fs/promises';
import { createServer } from 'node:net';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { setTimeout } from 'node:timers/promises';
import test from 'node:test';
import process from 'node:process';

test('HTTP errors and health return safe JSON without ever contacting Telegram', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'design-lead-http-'));
  const api = join(directory, 'api');
  await mkdir(api);
  await copyFile('public/api/lead.php', join(api, 'lead.php'));
  const socket = createServer();
  socket.listen(0, '127.0.0.1');
  await once(socket, 'listening');
  const { port } = socket.address();
  await new Promise((resolve) => socket.close(resolve));
  // Fresh document root has no secret config. All environment credentials are cleared.
  const server = spawn('php', ['-S', `127.0.0.1:${port}`, '-t', directory], {
    env: {
      ...process.env,
      LEAD_TELEGRAM_BOT_TOKEN: '',
      LEAD_TELEGRAM_CHAT_ID: '',
      LEAD_TELEGRAM_CHAT_ID_ADDITIONAL: '',
      LEAD_STATE_DIR: '',
    },
    stdio: ['ignore', 'ignore', 'ignore'],
  });
  const endpoint = `http://127.0.0.1:${port}/api/lead.php`;
  try {
    let ready = false;
    for (let attempt = 0; attempt < 50 && !ready; attempt++) {
      try {
        ready = (await globalThis.fetch(endpoint)).status === 405;
      } catch {
        await setTimeout(40);
      }
    }
    assert.ok(ready, 'PHP HTTP fixture becomes ready');
    const cases = [
      [405, 'method_not_allowed', {}],
      [415, 'unsupported_media_type', { method: 'POST', body: '{}' }],
      [
        403,
        'origin_not_allowed',
        {
          method: 'POST',
          body: '{}',
          headers: { 'content-type': 'application/json', origin: 'https://attacker.invalid' },
        },
      ],
      [
        400,
        'invalid_json',
        { method: 'POST', body: '{', headers: { 'content-type': 'application/json' } },
      ],
      [
        422,
        'validation_failed',
        { method: 'POST', body: '{}', headers: { 'content-type': 'application/json' } },
      ],
      [
        413,
        'payload_too_large',
        {
          method: 'POST',
          body: 'x'.repeat(32769),
          headers: { 'content-type': 'application/json' },
        },
      ],
    ];
    for (const [status, error, options] of cases) {
      const response = await globalThis.fetch(endpoint, options);
      assert.equal(response.status, status);
      assert.match(response.headers.get('content-type'), /application\/json/);
      assert.equal(response.headers.get('cache-control'), 'no-store');
      assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
      assert.deepEqual(await response.json(), { ok: false, error });
    }
    const health = await globalThis.fetch(`${endpoint}?health=1`);
    assert.equal(health.status, 503);
    assert.deepEqual(await health.json(), { ok: false, error: 'delivery_unavailable' });
    const bot = await globalThis.fetch(endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ website: 'spam.example' }),
    });
    assert.equal(bot.status, 200);
    assert.deepEqual(await bot.json(), { ok: true });
  } finally {
    const stopped = once(server, 'exit');
    server.kill('SIGTERM');
    await stopped;
    await rm(directory, { recursive: true, force: true });
  }
});
