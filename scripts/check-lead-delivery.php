<?php

declare(strict_types=1);

require __DIR__ . '/../public/api/lead.php';

// Проверяем доступы перед публикацией без отправки сообщений и чтения входящих.
try {
    $configPath = $argv[1] ?? __DIR__ . '/../build/client/api/.lead-config.php';
    if (!is_file($configPath)) {
        throw new RuntimeException('Lead configuration has not been generated');
    }
    $config = require $configPath;
    if (!is_array($config)) {
        throw new RuntimeException('Lead configuration is invalid');
    }
    $recipients = deliveryRecipients($config);
    $deadline = microtime(true) + 20;
    $bot = telegramRequest($config['telegramBotToken'], 'getMe', [], $deadline);
    if (($bot['is_bot'] ?? false) !== true || !is_int($bot['id'] ?? null)) {
        throw new RuntimeException('Telegram bot identity unavailable');
    }
    echo "Telegram bot authentication: OK\n";

    foreach ($recipients as $recipient) {
        $chat = telegramRequest($config['telegramBotToken'], 'getChat', [
            'chat_id' => $recipient['target'],
        ], $deadline);
        if ((string) ($chat['id'] ?? '') !== $recipient['target']) {
            throw new RuntimeException('Telegram chat unavailable; both recipients must start the bot');
        }
    }
    echo "Both Telegram chats: OK\n";
} catch (Throwable $error) {
    // Низкоуровневое исключение может включать URL с токеном: выводим только безопасный итог.
    fwrite(STDERR, "Lead delivery preflight failed. Check bot token, both chat IDs and Telegram network access.\n");
    exit(1);
}
