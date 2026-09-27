import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtemp, readFile, rm, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

const fixture = {
  LEAD_TELEGRAM_BOT_TOKEN: `123456:${'a'.repeat(32)}`,
  LEAD_TELEGRAM_CHAT_ID: '100001',
  LEAD_TELEGRAM_CHAT_ID_ADDITIONAL: '100002',
};

async function generate(overrides, verify) {
  const directory = await mkdtemp(join(tmpdir(), 'design-lead-config-test-'));
  const target = join(directory, '.lead-config.php');
  try {
    const result = spawnSync(process.execPath, ['scripts/generate-lead-config.mjs', target], {
      env: { ...process.env, ...fixture, ...overrides },
      encoding: 'utf8',
    });
    await verify(result, target);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

test('generates a protected config for both distinct Telegram recipients', async () => {
  await generate({}, async (result, target) => {
    assert.equal(result.status, 0);
    assert.equal((await stat(target)).mode & 0o777, 0o600);
    const content = await readFile(target, 'utf8');
    assert.match(content, /http_response_code\(404\)/);
    assert.match(content, /telegramAdditionalChatId/);
    assert.doesNotMatch(content, /smtp|email|yandex/i);
    for (const value of Object.values(fixture)) {
      assert.ok(content.includes(Buffer.from(value).toString('base64')));
      assert.ok(!result.stdout.includes(value));
      assert.ok(!result.stderr.includes(value));
    }
  });
});

for (const [name, overrides] of [
  ['missing bot token', { LEAD_TELEGRAM_BOT_TOKEN: '' }],
  ['missing primary recipient', { LEAD_TELEGRAM_CHAT_ID: '' }],
  ['missing additional recipient', { LEAD_TELEGRAM_CHAT_ID_ADDITIONAL: '' }],
  ['personal username', { LEAD_TELEGRAM_CHAT_ID: '@some_user' }],
  ['duplicate recipients', { LEAD_TELEGRAM_CHAT_ID_ADDITIONAL: '100001' }],
  ['invalid bot token', { LEAD_TELEGRAM_BOT_TOKEN: 'invalid' }],
]) {
  test(`blocks deployment with ${name}`, async () => {
    await generate(overrides, async (result, target) => {
      assert.notEqual(result.status, 0);
      await assert.rejects(stat(target), { code: 'ENOENT' });
    });
  });
}
