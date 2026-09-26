<?php

declare(strict_types=1);

require __DIR__ . '/../public/api/lead.php';

// Проверяем доступы перед публикацией, не отправляя заявок и не читая почтовый ящик.
try {
    $configPath = $argv[1] ?? __DIR__ . '/../build/client/api/.lead-config.php';
    if (!is_file($configPath)) {
        throw new RuntimeException('Lead configuration has not been generated');
    }
    $config = require $configPath;
    $recipients = deliveryRecipients($config);
    $deadline = microtime(true) + 20;
    $context = stream_context_create(['ssl' => [
        'verify_peer' => true,
        'verify_peer_name' => true,
        'peer_name' => 'smtp.yandex.ru',
    ]]);
    $socket = @stream_socket_client(
        'ssl://smtp.yandex.ru:465', $errorNumber, $errorMessage,
        secondsRemaining($deadline), STREAM_CLIENT_CONNECT, $context,
    );
    if ($socket === false) {
        throw new RuntimeException('SMTP connection unavailable');
    }
    try {
        smtpRead($socket, [220], $deadline);
        smtpCommand($socket, 'EHLO designseichas.ru', [250], $deadline);
        smtpCommand($socket, 'AUTH LOGIN', [334], $deadline);
        smtpCommand($socket, base64_encode(LEAD_EMAIL_DEFAULT), [334], $deadline);
        smtpCommand($socket, base64_encode($config['smtpPassword']), [235], $deadline);
        @fwrite($socket, "QUIT\r\n");
    } finally {
        fclose($socket);
    }
    echo "Yandex SMTP authentication: OK\n";

    foreach ($recipients as $recipient) {
        if ($recipient['channel'] !== 'telegram') {
            continue;
        }
        $context = stream_context_create(['http' => [
            'method' => 'POST',
            'header' => "Content-Type: application/json\r\n",
            'content' => json_encode(['chat_id' => $recipient['target']]),
            'timeout' => 10,
            'ignore_errors' => true,
        ]]);
        $raw = @file_get_contents(
            'https://api.telegram.org/bot' . $config['telegramBotToken'] . '/getChat',
            false, $context,
        );
        $response = is_string($raw) ? json_decode($raw, true) : null;
        if (!is_array($response) || ($response['ok'] ?? false) !== true
            || (string) ($response['result']['id'] ?? '') !== $recipient['target']) {
            throw new RuntimeException('Telegram chat unavailable; both recipients must start the bot');
        }
    }
    echo "Both Telegram chats: OK\n";
} catch (Throwable $error) {
    // Низкоуровневое исключение может включать URL с токеном: выводим только безопасный итог.
    fwrite(STDERR, "Lead delivery preflight failed. Check SMTP app password, bot token, chat IDs and network access.\n");
    exit(1);
}
