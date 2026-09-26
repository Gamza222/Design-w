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

$config = [
    'smtpPassword' => 'test-only-password',
    'telegramBotToken' => '123456:' . str_repeat('a', 32),
    'telegramChatId' => '100001',
    'telegramAdditionalChatId' => '100002',
];
$recipients = deliveryRecipients($config);
check(count($recipients) === 4, 'All four recipients are required');
check($recipients[0]['target'] === 'dizain.seichas@yandex.ru', 'Studio receives email');
check($recipients[1]['target'] === 'gamzaweb@gmail.com', 'Additional inbox receives email');
check($recipients[2]['target'] === '100001' && $recipients[3]['target'] === '100002', 'Both chats receive leads');

foreach (['@designnoww', '0', 'not-an-id', '100001'] as $invalidId) {
    rejects(static function () use ($config, $invalidId): void {
        deliveryRecipients(array_merge($config, ['telegramAdditionalChatId' => $invalidId]));
    }, RuntimeException::class, 'Invalid or duplicate chat configuration rejected');
}

$handle = tmpfile();
check($handle !== false, 'Temporary state opens');
$attempts = [];
$fingerprint = hash('sha256', 'original lead details');
$first = deliverLeadRecipients($handle, $recipients, $fingerprint, static function (array $recipient) use (&$attempts): void {
    $attempts[] = $recipient['target'];
    if ($recipient['target'] === '100002') {
        throw new RuntimeException('Simulated recipient outage');
    }
});
check(count($first) === 1, 'Partial failure is reported');
check(count($attempts) === 4, 'Every recipient is attempted');

$attempts = [];
$retry = deliverLeadRecipients($handle, $recipients, $fingerprint, static function (array $recipient) use (&$attempts): void {
    $attempts[] = $recipient['target'];
});
check($retry === [], 'Retry completes delivery');
check($attempts === ['100002'], 'Retry skips all confirmed recipients');

$attempts = [];
deliverLeadRecipients($handle, $recipients, $fingerprint, static function (array $recipient) use (&$attempts): void {
    $attempts[] = $recipient['target'];
});
check($attempts === [], 'A completed lead is not sent twice');

rejects(static function () use ($handle, $recipients): void {
    deliverLeadRecipients($handle, $recipients, hash('sha256', 'changed phone'), static function (): void {});
}, DomainException::class, 'Changed details must not reuse a delivered ID');
fclose($handle);

$handle = tmpfile();
fwrite($handle, 'corrupted state');
rejects(static function () use ($handle): void {
    readDeliveryState($handle);
}, RuntimeException::class, 'Corrupt state must not silently resend');
fclose($handle);

check(cleanLine("  Анна\r\nИванова\0  ", 120) === 'Анна Иванова', 'Control characters removed');
check(cleanText(str_repeat('я', 20), 9) === str_repeat('я', 4), 'UTF-8 truncation stays valid');
check(cleanText(['unexpected'], 120) === '', 'Unexpected data type rejected');
$message = buildLeadMessage([
    'kind' => 'project', 'name' => 'Тест', 'phone' => '+7 000 000-00-00',
    'area' => '72', 'premises' => 'apartment', 'package' => 'full',
    'comment' => str_repeat('A', 2800), 'locale' => 'ru', 'page' => '/contact',
], 'backend-test-123456');
check(strlen($message) < 4096, 'Lead fits Telegram message limit even using byte count');
check(strpos($message, 'Согласие на обработку данных: получено') !== false, 'Consent is included');
check(strpos($message, 'Площадь: 72') !== false, 'Project details are included');

$_SERVER['HTTP_ORIGIN'] = 'https://designseichas.ru';
check(isAllowedOrigin(), 'Production origin accepted');
$_SERVER['HTTP_ORIGIN'] = 'https://designseichas.ru.attacker.invalid';
check(!isAllowedOrigin(), 'Lookalike origin rejected');

echo 'Lead backend: ' . $assertions . " assertions passed\n";
