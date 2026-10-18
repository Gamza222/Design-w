<?php

declare(strict_types=1);

require __DIR__ . '/../../public/api/lead.php';

$assertions = 0;
function check(bool $condition, string $label): void
{
    global $assertions;
    if (!$condition) {
        throw new RuntimeException($label);
    }
    $assertions++;
}

function rejects(callable $operation, string $exceptionType, string $label): void
{
    $caught = null;
    try {
        $operation();
    } catch (Throwable $error) {
        $caught = $error;
    }
    check($caught instanceof $exceptionType, $label);
}

function fixtureConfig(): array
{
    return [
        'telegramBotToken' => '123456:' . str_repeat('a', 32),
        'telegramChatId' => '100001',
        'telegramAdditionalChatId' => '100002',
    ];
}

function fixturePayload(string $id = 'isolated-submission-123456'): array
{
    return [
        'kind' => 'consultation', 'name' => 'Тест', 'phone' => '+7 000 000-00-00',
        'consent' => true, 'locale' => 'ru', 'page' => '/services/', 'submissionId' => $id,
        'context' => [
            'source' => 'calculator', 'service' => 'Дизайн-проект', 'project' => 'minimal-loft',
            'area' => 72, 'packageId' => 'drawings', 'packageName' => 'Чертежи',
            'extras' => ['3D-визуализации — от 1 000 ₽/м²', 'Авторский надзор — от 30 000 ₽/месяц'],
            'estimate' => 216000, 'currency' => 'RUB', 'preliminary' => true,
        ],
        'attribution' => ['utm_source' => 'search', 'utm_campaign' => 'interior', 'referrer' => 'https://example.test/search?q=private#private'],
    ];
}

function isolatedDirectory(string $directory): string
{
    foreach (['', '/locks', '/deliveries', '/numbers', '/rate'] as $suffix) {
        ensurePrivateDirectory($directory . $suffix);
    }
    return $directory;
}

function removeTestDirectory(string $directory): void
{
    foreach (new FilesystemIterator($directory, FilesystemIterator::SKIP_DOTS) as $item) {
        if ($item->isDir() && !$item->isLink()) {
            removeTestDirectory($item->getPathname());
        } else {
            unlink($item->getPathname());
        }
    }
    rmdir($directory);
}

/** @return array{0: resource, 1: array<int, resource>} */
function startWorker(string $mode, string $directory, string $id): array
{
    $pipes = [];
    $process = proc_open([PHP_BINARY, __FILE__, '--worker', $mode, $directory, $id],
        [0 => ['pipe', 'r'], 1 => ['pipe', 'w'], 2 => ['pipe', 'w']], $pipes);
    if (!is_resource($process)) {
        throw new RuntimeException('Unable to start isolated PHP worker');
    }
    fclose($pipes[0]);
    return [$process, $pipes];
}

function finishWorker(array $worker): array
{
    [$process, $pipes] = $worker;
    $output = stream_get_contents($pipes[1]);
    $error = stream_get_contents($pipes[2]);
    fclose($pipes[1]);
    fclose($pipes[2]);
    check(proc_close($process) === 0, 'Parallel worker exits normally: ' . $error);
    $result = json_decode($output, true);
    check(is_array($result), 'Parallel worker returns JSON');
    return $result;
}

// Worker entrypoints never have a real network sender or load deployment credentials.
if (($argv[1] ?? '') === '--worker') {
    [$mode, $directory, $id] = array_slice($argv, 2);
    if ($mode === 'collision') {
        $lock = openDeliveryState($id, $directory);
        $first = true;
        $state = prepareDeliveryState($lock, hash('sha256', $id), static function () use (&$first): string {
            if ($first) {
                $first = false;
                return '222222222';
            }
            return generateLeadNumber();
        });
        closeDeliveryState($lock);
        echo json_encode(['number' => $state['leadNumber']]);
    } elseif ($mode === 'request') {
        $result = processLeadPayload(fixturePayload($id), fixtureConfig(), 'worker-' . $id,
            static function (string $token, string $chat, string $message) use ($directory): void {
                file_put_contents($directory . '/sent.log', $chat . "\n", FILE_APPEND | LOCK_EX);
                usleep(75000);
            }, $directory);
        echo json_encode($result);
    } elseif ($mode === 'atomic-read') {
        for ($index = 0; $index < 1800; $index++) {
            $data = json_decode((string) file_get_contents($directory . '/probe.json'), true);
            if (!is_array($data) || !isset($data['counter']) || strlen($data['padding'] ?? '') !== 8192) {
                throw new RuntimeException('Reader observed a partial state file');
            }
            usleep(500);
        }
        echo json_encode(['ok' => true]);
    } else {
        throw new RuntimeException('Unknown isolated worker mode');
    }
    exit;
}

$root = sys_get_temp_dir() . '/design-lead-test-' . bin2hex(random_bytes(8));
isolatedDirectory($root);
try {
    $config = fixtureConfig();
    check(leadHealth($config, $root) === [200, ['ok' => true, 'storage' => 'ready', 'recipients' => 2]],
        'Health verifies writable atomic storage and two recipients without Telegram traffic');
    check(glob($root . '/.health-*') === [], 'Health removes its storage probe');
    check(leadHealth([], $root)[0] === 503, 'Health fails with incomplete delivery configuration');
    $recipients = deliveryRecipients($config);
    check(count($recipients) === 2, 'Exactly two Telegram recipients are required');
    check(array_column($recipients, 'target') === ['100001', '100002'], 'Both configured chats receive leads');
    foreach (['telegramBotToken', 'telegramChatId', 'telegramAdditionalChatId'] as $key) {
        rejects(static function () use ($config, $key): void {
            unset($config[$key]);
            deliveryRecipients($config);
        }, RuntimeException::class, 'Missing credential blocks delivery');
    }
    foreach (['@username', '0', 'not-an-id', '100001'] as $invalid) {
        rejects(static function () use ($config, $invalid): void {
            deliveryRecipients(array_merge($config, ['telegramAdditionalChatId' => $invalid]));
        }, RuntimeException::class, 'Invalid or repeated recipient blocks delivery');
    }
    rejects(static function () use ($config): void {
        telegramRequest($config['telegramBotToken'], 'deleteWebhook', [], microtime(true) + 1);
    }, RuntimeException::class, 'Unsupported Telegram operation is rejected before network access');

    $payload = fixturePayload();
    $attempts = [];
    $messages = [];
    $first = processLeadPayload($payload, $config, 'test-ip',
        static function (string $token, string $chat, string $message) use (&$attempts, &$messages): void {
            $attempts[] = $chat;
            $messages[] = $message;
            if ($chat === '100002') {
                throw new RuntimeException('Simulated outage with private credentials');
            }
        }, $root);
    check($first[0] === 502 && $first[1]['error'] === 'delivery_failed', 'Partial failure is not reported as success');
    $number = $first[1]['leadNumber'];
    check(isLeadNumber($number) && strlen($number) === 9, 'Public number is nine unambiguous characters');
    check($first[1]['requestId'] === $number, 'Backward-compatible request ID contains the public number');
    check($attempts === ['100001', '100002'], 'Both recipients are attempted on first delivery');
    check($messages[0] === $messages[1], 'Both Telegram messages carry identical context and number');
    check(strpos($messages[0], 'Номер: ' . $number) !== false, 'Telegram contains the public number');
    check(strpos($messages[0], $payload['submissionId']) === false, 'Internal idempotency key stays private');
    foreach (['Источник: calculator', 'Кейс: minimal-loft', '72 м²', 'Чертежи', '216 000 RUB', 'utm_campaign: interior', 'Авторский надзор'] as $text) {
        check(strpos($messages[0], $text) !== false, 'Context reaches both Telegram messages: ' . $text);
    }
    check(strpos($messages[0], 'private') === false, 'Referrer query and fragment are excluded');

    $attempts = [];
    $retry = processLeadPayload($payload, $config, 'test-ip',
        static function (string $token, string $chat, string $message) use (&$attempts, $messages): void {
            $attempts[] = $chat;
            check($message === $messages[0], 'Retry preserves date, number and context');
        }, $root);
    check($retry[0] === 200 && $retry[1]['leadNumber'] === $number, 'Retry preserves the public number');
    check($attempts === ['100002'], 'Retry sends only to the unconfirmed recipient');
    $neverSend = static function (): void { throw new LogicException('Unexpected delivery'); };
    for ($index = 0; $index < 8; $index++) {
        $again = processLeadPayload($payload, $config, 'test-ip', $neverSend, $root);
        check($again === $retry, 'Completed retry is stable even after repeated requests');
    }
    $changed = $payload;
    $changed['context']['estimate']++;
    $conflict = processLeadPayload($changed, $config, 'test-ip', $neverSend, $root);
    check($conflict[0] === 409, 'Changed calculator data cannot reuse an idempotency key');
    $recordPath = $root . '/deliveries/' . hash('sha256', $payload['submissionId']) . '.json';
    $record = file_get_contents($recordPath);
    check(strpos($record, $payload['phone']) === false && strpos($record, $payload['name']) === false, 'Storage contains no contact text');
    check((fileperms($recordPath) & 0777) === 0600, 'Saved state is private');

    $held = openDeliveryState($payload['submissionId'], $root);
    $busy = processLeadPayload($payload, $config, 'test-ip', $neverSend, $root);
    check($busy[0] === 503 && $busy[1]['error'] === 'submission_busy', 'Concurrent same-ID request receives a recoverable busy response');
    closeDeliveryState($held);

    $invalidPayloads = [
        ['consent' => false], ['phone' => '123'], ['name' => ''], ['submissionId' => '../invalid'],
        ['context' => []], ['context' => ['source' => 'calculator', 'area' => -1]],
        ['context' => ['source' => 'calculator', 'estimate' => 123]],
        ['context' => ['source' => 'calculator', 'currency' => 'USD']],
        ['context' => ['source' => 'calculator', 'extras' => [false]]],
        ['context' => ['source' => 'calculator', 'preliminary' => 'true']],
        ['context' => ['source' => 'calculator', 'packageId' => 'ergonomics']],
        ['attribution' => ['utm_source' => []]], ['attribution' => ['referrer' => 'javascript:invalid']],
        ['kind' => 'project'],
    ];
    foreach ($invalidPayloads as $invalid) {
        check(processLeadPayload(array_replace($payload, $invalid), $config, 'validation-ip', $neverSend, $root)[0] === 422,
            'Invalid data is rejected without allocating a number or sending');
    }
    $project = array_replace($payload, ['kind' => 'project', 'area' => '72', 'premises' => 'apartment', 'package' => 'drawings']);
    check(normalizeLeadPayload($project)['package'] === 'drawings', 'Full project validation accepts the current drawings package');
    $by = $payload;
    $by['locale'] = 'by';
    $by['context']['estimate'] = 7560;
    $by['context']['currency'] = 'BYN';
    check(strpos(buildLeadMessage(normalizeLeadPayload($by), $number), '7 560 BYN') !== false, 'BYN quote is preserved without conversion');
    check(cleanLine("  Анна\r\nИванова\0  ", 120) === 'Анна Иванова', 'Control characters are removed');
    check(cleanText(str_repeat('я', 20), 9) === str_repeat('я', 4), 'UTF-8 truncation stays valid');
    $largest = $project;
    $largest['comment'] = str_repeat('A', 2800);
    $largest['context']['extras'] = array_fill(0, 8, str_repeat('B', 159));
    $largest['attribution'] = array_fill_keys(['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'], str_repeat('C', 160));
    $largeMessage = buildLeadMessage(normalizeLeadPayload($largest), $number);
    check(textCharacterCount($largeMessage) <= 4096, 'Maximum-size Telegram message respects the character limit');
    check(strpos($largeMessage, 'utm_term:') !== false, 'Long comment does not displace attribution');
    $_SERVER['HTTP_ORIGIN'] = 'https://designseichas.ru';
    check(isAllowedOrigin(), 'Production origin accepted');
    $_SERVER['HTTP_ORIGIN'] = 'https://designseichas.ru.attacker.invalid';
    check(!isAllowedOrigin(), 'Lookalike origin rejected');

    foreach (['/', '/tmp/design-leads', '/var/tmp/design-leads', 'relative/path', __DIR__ . '/../../public/api/state'] as $path) {
        rejects(static function () use ($path): void {
            stateDirectory(['stateDirectory' => $path]);
        }, RuntimeException::class, 'Production storage rejects temporary, relative, traversal and public paths');
    }

    // Force a collision, including a reservation left by a crashed allocation.
    $collisionDirectory = isolatedDirectory($root . '/collision');
    $one = openDeliveryState('collision-original-123456', $collisionDirectory);
    $reserved = reserveLeadNumber($one, static function (): string { return 'AAAAAAAAA'; });
    closeDeliveryState($one);
    $two = openDeliveryState('collision-next-lead-123456', $collisionDirectory);
    $candidates = ['AAAAAAAAA', 'BBBBBBBBB'];
    $state = prepareDeliveryState($two, hash('sha256', 'two'), static function () use (&$candidates): string {
        return array_shift($candidates);
    });
    check($reserved === 'AAAAAAAAA' && $state['leadNumber'] === 'BBBBBBBBB', 'Collision retries without recycling an orphaned number');
    closeDeliveryState($two);
    $exhausted = openDeliveryState('collision-exhausted-123456', $collisionDirectory);
    rejects(static function () use ($exhausted): void {
        prepareDeliveryState($exhausted, hash('sha256', 'exhausted'), static function (): string { return 'AAAAAAAAA'; });
    }, RuntimeException::class, 'Persistent collisions fail without delivery');
    closeDeliveryState($exhausted);

    // Multiple independent PHP processes all try the same initial number.
    $parallel = isolatedDirectory($root . '/parallel');
    $workers = [];
    for ($index = 0; $index < 12; $index++) {
        $workers[] = startWorker('collision', $parallel, 'parallel-submission-' . $index);
    }
    $numbers = [];
    foreach ($workers as $worker) {
        $numbers[] = finishWorker($worker)['number'];
    }
    check(count(array_unique($numbers)) === 12, 'Parallel allocations are collision-safe');
    check(count(array_filter($numbers, static function (string $value): bool { return $value === '222222222'; })) === 1,
        'Exactly one process owns the contested public number');
    check(count(glob($parallel . '/numbers/*')) === 12, 'Registry records every concurrent allocation');

    // Independent requests for the same submission deliver exactly two local fake messages.
    $same = isolatedDirectory($root . '/same-submission');
    $workers = [];
    for ($index = 0; $index < 10; $index++) {
        $workers[] = startWorker('request', $same, 'parallel-shared-submission');
    }
    $successes = [];
    foreach ($workers as $worker) {
        $result = finishWorker($worker);
        check(in_array($result[0], [200, 503], true), 'Concurrent same-ID request completes or asks for retry');
        if ($result[0] === 200) {
            $successes[] = $result[1]['leadNumber'];
        }
    }
    check(count($successes) >= 1 && count(array_unique($successes)) === 1, 'Same-ID parallel successes share one number');
    check(file($same . '/sent.log', FILE_IGNORE_NEW_LINES) === ['100001', '100002'], 'Concurrent requests never resend confirmed Telegram messages');
    check(processLeadPayload(fixturePayload('parallel-shared-submission'), $config, 'retry-ip', $neverSend, $same)[0] === 200,
        'Busy parallel request can safely retry');

    // Readers never see a truncated/half-written JSON record during atomic replacement.
    $atomic = isolatedDirectory($root . '/atomic');
    writeAtomicJson($atomic . '/probe.json', ['counter' => 0, 'padding' => str_repeat('x', 8192)]);
    $reader = startWorker('atomic-read', $atomic, 'unused');
    for ($index = 1; $index <= 100; $index++) {
        writeAtomicJson($atomic . '/probe.json', ['counter' => $index, 'padding' => str_repeat('x', 8192)]);
    }
    check(finishWorker($reader)['ok'] === true, 'Concurrent readers only observe complete committed JSON');
    check(glob($atomic . '/.pending-*') === [], 'Atomic writes remove their temporary files');

    $errors = isolatedDirectory($root . '/errors');
    $failedPayload = fixturePayload('failed-submission-123456');
    $allFailed = processLeadPayload($failedPayload, $config, 'error-ip', $neverSend, $errors);
    check($allFailed[0] === 502 && isLeadNumber($allFailed[1]['leadNumber']), 'Both delivery failures preserve the allocated number');
    $recoveryCalls = [];
    $recovered = processLeadPayload($failedPayload, $config, 'error-ip',
        static function (string $token, string $chat) use (&$recoveryCalls): void { $recoveryCalls[] = $chat; }, $errors);
    check($recovered[0] === 200 && $recovered[1]['leadNumber'] === $allFailed[1]['leadNumber'], 'Full outage recovery keeps the public number');
    check($recoveryCalls === ['100001', '100002'], 'Recovery retries both missing deliveries');
    $corruptPath = $errors . '/deliveries/' . hash('sha256', $failedPayload['submissionId']) . '.json';
    $saved = file_get_contents($corruptPath);
    file_put_contents($corruptPath, 'corrupted state');
    check(processLeadPayload($failedPayload, $config, 'error-ip', $neverSend, $errors)[0] === 503, 'Corrupt state fails closed without resending');
    file_put_contents($corruptPath, $saved);
    unlink($errors . '/numbers/' . $recovered[1]['leadNumber']);
    check(processLeadPayload($failedPayload, $config, 'error-ip', $neverSend, $errors)[0] === 503, 'Missing registry record fails closed');
    $unavailable = $root . '/missing/directory';
    check(processLeadPayload(fixturePayload('unavailable-state-123456'), $config, 'error-ip', $neverSend, $unavailable)[0] === 503,
        'Unavailable storage never sends a message');
    check(processLeadPayload($payload, [], 'error-ip', $neverSend, $root)[0] === 503, 'Incomplete configuration never sends');

    $rateDirectory = isolatedDirectory($root . '/rate-limit');
    for ($index = 0; $index < LEAD_RATE_LIMIT; $index++) {
        check(!isRateLimited('limited-ip', $rateDirectory), 'Initial new submissions fit the IP limit');
    }
    check(processLeadPayload(fixturePayload('limited-submission-123456'), $config, 'limited-ip', $neverSend, $rateDirectory)[0] === 429,
        'New submission over the rate limit is rejected before allocating a number');
    check(glob($rateDirectory . '/numbers/*') === [], 'Rate-limited request reserves no number');
    $honeypot = processLeadPayload(['website' => 'spam.example'], [], 'bot', $neverSend, $unavailable);
    check($honeypot === [200, ['ok' => true]], 'Honeypot exits without storage or delivery');

    // Existing confirmation history is imported without storing contact data or resending.
    $legacy = isolatedDirectory($root . '/legacy-source');
    $migrated = isolatedDirectory($root . '/legacy-destination');
    $legacyHash = hash('sha256', 'legacy-submission-123456');
    $fingerprint = hash('sha256', 'legacy-details');
    $legacyState = [
        'fingerprint' => $fingerprint,
        'delivered' => ['telegram:' . hash('sha256', '100001') => true],
        'updatedAt' => 1700000000,
    ];
    file_put_contents($legacy . '/delivery-' . $legacyHash . '.json', json_encode($legacyState));
    $lock = openDeliveryStateByHash($legacyHash, $migrated, $legacy);
    $migrationState = prepareDeliveryState($lock, $fingerprint);
    $migrationCalls = [];
    deliverLeadRecipients($lock, $recipients, $fingerprint,
        static function (array $recipient) use (&$migrationCalls): void { $migrationCalls[] = $recipient['target']; });
    closeDeliveryState($lock);
    check($migrationCalls === ['100002'], 'Migrating old partial delivery does not resend the confirmed message');
    check($migrationState['createdAt'] === 1700000000, 'Migration preserves the original recorded time');
    unlink($legacy . '/delivery-' . $legacyHash . '.json');
    $lock = openDeliveryStateByHash($legacyHash, $migrated);
    check(prepareDeliveryState($lock, $fingerprint)['leadNumber'] === $migrationState['leadNumber'], 'Deleting old temporary history does not affect the durable record');
    closeDeliveryState($lock);

    echo 'Lead backend: ' . $assertions . " assertions passed (isolated; no network messages)\n";
} finally {
    removeTestDirectory($root);
}
