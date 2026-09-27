<?php

declare(strict_types=1);

const LEAD_MAX_BODY_BYTES = 32768;
const LEAD_RATE_LIMIT = 5;
const LEAD_RATE_WINDOW_SECONDS = 600;
const LEAD_DELIVERY_TIMEOUT_SECONDS = 24;

function stateDirectory(): string
{
    $directory = sys_get_temp_dir() . '/design-seichas-' . substr(hash('sha256', __DIR__), 0, 16);
    if (!is_dir($directory) && !@mkdir($directory, 0700, true) && !is_dir($directory)) {
        throw new RuntimeException('Delivery state directory is unavailable');
    }
    return $directory;
}

/** @param array<string, mixed> $payload */
function respond(int $status, array $payload): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    header('X-Content-Type-Options: nosniff');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function cleanText($value, int $maxBytes): string
{
    if (!is_string($value)) {
        return '';
    }

    $value = str_replace(["\r\n", "\r"], "\n", trim($value));
    $cleaned = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $value);
    if (!is_string($cleaned)) {
        return '';
    }

    if (strlen($cleaned) <= $maxBytes) {
        return $cleaned;
    }

    while ($maxBytes > 0 && (ord($cleaned[$maxBytes]) & 0xC0) === 0x80) {
        $maxBytes--;
    }
    return substr($cleaned, 0, $maxBytes);
}

function cleanLine($value, int $maxBytes): string
{
    return str_replace("\n", ' ', cleanText($value, $maxBytes));
}

function isAllowedOrigin(): bool
{
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if (!is_string($origin) || $origin === '') {
        return true;
    }

    $host = parse_url($origin, PHP_URL_HOST);
    return is_string($host) && in_array(
        strtolower($host),
        ['designseichas.ru', 'www.designseichas.ru', 'localhost', '127.0.0.1'],
        true,
    );
}

function isRateLimited(string $ip): bool
{
    $path = stateDirectory() . '/rate-' . hash('sha256', $ip) . '.json';
    $handle = @fopen($path, 'c+');
    if ($handle === false || !flock($handle, LOCK_EX)) {
        if (is_resource($handle)) {
            fclose($handle);
        }
        throw new RuntimeException('Rate limit storage is unavailable');
    }

    $raw = stream_get_contents($handle);
    $decoded = is_string($raw) && $raw !== '' ? json_decode($raw, true) : [];
    $now = time();
    $threshold = $now - LEAD_RATE_WINDOW_SECONDS;
    $hits = [];

    if (is_array($decoded)) {
        foreach ($decoded as $timestamp) {
            if (is_int($timestamp) && $timestamp > $threshold) {
                $hits[] = $timestamp;
            }
        }
    }

    $limited = count($hits) >= LEAD_RATE_LIMIT;
    if (!$limited) {
        $hits[] = $now;
        rewind($handle);
        ftruncate($handle, 0);
        fwrite($handle, (string) json_encode($hits));
        fflush($handle);
    }

    flock($handle, LOCK_UN);
    fclose($handle);
    return $limited;
}

/** @return resource|false */
function openDeliveryState(string $submissionId)
{
    $path = stateDirectory() . '/delivery-' . hash('sha256', $submissionId) . '.json';
    $handle = @fopen($path, 'c+');
    if ($handle === false || !flock($handle, LOCK_EX | LOCK_NB)) {
        if (is_resource($handle)) {
            fclose($handle);
        }
        return false;
    }
    return $handle;
}

/** @param resource $handle @return array{fingerprint: string, delivered: array<string, bool>} */
function readDeliveryState($handle): array
{
    rewind($handle);
    $raw = stream_get_contents($handle);
    if ($raw === '') {
        return ['fingerprint' => '', 'delivered' => []];
    }
    $decoded = is_string($raw) ? json_decode($raw, true) : null;
    if (!is_array($decoded) || !is_string($decoded['fingerprint'] ?? null)
        || !is_array($decoded['delivered'] ?? null)) {
        throw new RuntimeException('Delivery state is unreadable');
    }
    return [
        'fingerprint' => $decoded['fingerprint'],
        'delivered' => $decoded['delivered'],
    ];
}

/** @param resource $handle @param array{fingerprint: string, delivered: array<string, bool>} $state */
function writeDeliveryState($handle, array $state): void
{
    rewind($handle);
    $json = (string) json_encode($state + ['updatedAt' => time()]);
    if (!ftruncate($handle, 0) || fwrite($handle, $json) !== strlen($json) || !fflush($handle)) {
        throw new RuntimeException('Delivery state could not be saved');
    }
}

/** @return array<string, string> */
function loadDeliveryConfig(): array
{
    $fileConfig = [];
    $path = __DIR__ . '/.lead-config.php';
    if (is_file($path) && is_readable($path)) {
        $decoded = require $path;
        if (is_array($decoded)) {
            $fileConfig = $decoded;
        }
    }

    $read = static function (string $environmentKey, string $fileKey) use ($fileConfig): string {
        $environmentValue = getenv($environmentKey);
        if (is_string($environmentValue) && $environmentValue !== '') {
            return $environmentValue;
        }

        $fileValue = $fileConfig[$fileKey] ?? '';
        return is_string($fileValue) ? $fileValue : '';
    };

    return [
        'telegramBotToken' => $read('LEAD_TELEGRAM_BOT_TOKEN', 'telegramBotToken'),
        'telegramChatId' => $read('LEAD_TELEGRAM_CHAT_ID', 'telegramChatId'),
        'telegramAdditionalChatId' => $read('LEAD_TELEGRAM_CHAT_ID_ADDITIONAL', 'telegramAdditionalChatId'),
    ];
}

/** @param array<string, string> $config @return array<int, array{channel: string, target: string}> */
function deliveryRecipients(array $config): array
{
    if (preg_match('/^\d+:[A-Za-z0-9_-]{30,}$/', $config['telegramBotToken'] ?? '') !== 1) {
        throw new RuntimeException('Delivery credentials are incomplete');
    }
    $chatIds = [$config['telegramChatId'] ?? '', $config['telegramAdditionalChatId'] ?? ''];
    foreach ($chatIds as $chatId) {
        // Личные username не принимаются Bot API: нужны ID чатов после /start.
        if (preg_match('/^-?[1-9]\d{0,19}$/', $chatId) !== 1) {
            throw new RuntimeException('Both Telegram recipients need numeric chat IDs');
        }
    }
    if ($chatIds[0] === $chatIds[1]) {
        throw new RuntimeException('Telegram recipients must be distinct');
    }
    $recipients = [];
    foreach ($chatIds as $chatId) {
        $recipients[] = ['channel' => 'telegram', 'target' => $chatId];
    }
    return $recipients;
}

/**
 * @param resource $handle
 * @param array<int, array{channel: string, target: string}> $recipients
 * @return array<int, string>
 */
function deliverLeadRecipients($handle, array $recipients, string $fingerprint, callable $send): array
{
    $state = readDeliveryState($handle);
    if ($state['fingerprint'] !== '' && !hash_equals($state['fingerprint'], $fingerprint)) {
        throw new DomainException('Submission ID belongs to different lead details');
    }
    $state['fingerprint'] = $fingerprint;
    writeDeliveryState($handle, $state);
    $failures = [];
    foreach ($recipients as $recipient) {
        $key = $recipient['channel'] . ':' . hash('sha256', $recipient['target']);
        if (($state['delivered'][$key] ?? false) === true) {
            continue;
        }
        try {
            $send($recipient);
        } catch (Throwable $error) {
            // Ни адресаты, ни содержание заявки, ни учётные данные не попадают в журнал.
            error_log('[lead] ' . $recipient['channel'] . ' delivery failed: ' . $error->getMessage());
            $failures[] = $key;
            continue;
        }
        $state['delivered'][$key] = true;
        writeDeliveryState($handle, $state);
    }
    return $failures;
}

function secondsRemaining(float $deadline): float
{
    $remaining = $deadline - microtime(true);
    if ($remaining <= 0) {
        throw new RuntimeException('Delivery time budget exhausted');
    }
    return min(5.0, $remaining);
}

/** @param array<string, mixed> $parameters @return array<string, mixed> */
function telegramRequest(string $token, string $method, array $parameters, float $deadline): array
{
    if (!preg_match('/^\d+:[A-Za-z0-9_-]{30,}$/', $token)) {
        throw new RuntimeException('Telegram bot token has an invalid format');
    }
    if (!in_array($method, ['getMe', 'getChat', 'sendMessage'], true)) {
        throw new RuntimeException('Unsupported Telegram operation');
    }

    $url = 'https://api.telegram.org/bot' . $token . '/' . $method;
    $payload = (string) json_encode(
        $parameters === [] ? (object) [] : $parameters,
        JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES,
    );

    $timeout = secondsRemaining($deadline);
    if (function_exists('curl_init')) {
        $curl = curl_init($url);
        if ($curl === false) {
            throw new RuntimeException('Telegram connection could not be initialized');
        }
        curl_setopt_array($curl, [
            CURLOPT_POST => true,
            CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
            CURLOPT_POSTFIELDS => $payload,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CONNECTTIMEOUT_MS => (int) ceil($timeout * 1000),
            CURLOPT_TIMEOUT_MS => (int) ceil($timeout * 1000),
            CURLOPT_SSL_VERIFYPEER => true,
            CURLOPT_SSL_VERIFYHOST => 2,
        ]);
        $response = curl_exec($curl);
        $status = (int) curl_getinfo($curl, CURLINFO_RESPONSE_CODE);
        curl_close($curl);
    } else {
        $context = stream_context_create([
            'http' => [
                'method' => 'POST',
                'header' => "Content-Type: application/json\r\n",
                'content' => $payload,
                'timeout' => $timeout,
                'ignore_errors' => true,
                'follow_location' => 0,
            ],
            'ssl' => ['verify_peer' => true, 'verify_peer_name' => true],
        ]);
        $response = @file_get_contents($url, false, $context);
        $statusLine = $http_response_header[0] ?? '';
        preg_match('/\s(\d{3})\s/', $statusLine, $matches);
        $status = isset($matches[1]) ? (int) $matches[1] : 0;
    }

    $decoded = is_string($response) ? json_decode($response, true) : null;
    if ($status < 200 || $status >= 300 || !is_array($decoded) || ($decoded['ok'] ?? false) !== true
        || !is_array($decoded['result'] ?? null)) {
        throw new RuntimeException('Telegram rejected the request with status ' . $status);
    }
    return $decoded['result'];
}

function sendTelegram(string $token, string $chatId, string $message, float $deadline): void
{
    if (!preg_match('/^-?[1-9]\d{0,19}$/', $chatId)) {
        throw new RuntimeException('Telegram chat id has an invalid format');
    }
    $result = telegramRequest($token, 'sendMessage', [
        'chat_id' => $chatId,
        'text' => $message,
        'link_preview_options' => ['is_disabled' => true],
    ], $deadline);
    if (!is_int($result['message_id'] ?? null)
        || (string) ($result['chat']['id'] ?? '') !== $chatId) {
        throw new RuntimeException('Telegram did not confirm the target recipient');
    }
}

/** @param array<string, string> $lead */
function buildLeadMessage(array $lead, string $requestId): string
{
    $premises = [
        'apartment' => 'Квартира',
        'house' => 'Дом',
        'office' => 'Коммерческое помещение',
    ];
    $packages = [
        'unknown' => 'Нужна помощь с выбором',
        'planning' => 'Планировочное решение',
        'collages' => 'Концепция и коллажи',
        'full' => 'Полный дизайн-проект',
        'planViz' => 'Планировка + визуализация',
        'electric' => 'Проект электрики',
        'viz3d' => '3D-визуализация',
        'procurement' => 'Комплектация',
        'supervision' => 'Авторский надзор',
        'ergonomics' => 'Эргономический аудит',
        'prelaunch' => 'Предпродажная подготовка',
    ];
    $isProject = $lead['kind'] === 'project';
    $lines = [
        $isProject ? 'Новая заявка на проект' : 'Новая заявка на консультацию',
        'Номер: ' . $requestId,
        'Дата: ' . date('d.m.Y H:i') . ' (МСК)',
        '',
        'Имя: ' . $lead['name'],
        'Телефон: ' . $lead['phone'],
        'Согласие на обработку данных: получено',
    ];

    if ($isProject) {
        $lines[] = 'Объект: ' . ($premises[$lead['premises']] ?? $lead['premises']);
        $lines[] = 'Площадь: ' . $lead['area'] . ' м²';
        $lines[] = 'Услуга: ' . ($packages[$lead['package']] ?? $lead['package']);
        if ($lead['comment'] !== '') {
            $lines[] = 'Комментарий: ' . $lead['comment'];
        }
    }

    $lines[] = '';
    $lines[] = 'Язык сайта: ' . ($lead['locale'] !== '' ? $lead['locale'] : 'не указан');
    $lines[] = 'Страница: ' . ($lead['page'] !== '' ? $lead['page'] : '/');
    return implode("\n", $lines);
}

function handleLeadRequest(): void
{
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    respond(405, ['ok' => false, 'error' => 'method_not_allowed']);
}

if (!isAllowedOrigin()) {
    respond(403, ['ok' => false, 'error' => 'origin_not_allowed']);
}

$contentType = $_SERVER['CONTENT_TYPE'] ?? '';
if (!is_string($contentType) || stripos($contentType, 'application/json') !== 0) {
    respond(415, ['ok' => false, 'error' => 'unsupported_media_type']);
}

$contentLength = (int) ($_SERVER['CONTENT_LENGTH'] ?? 0);
if ($contentLength > LEAD_MAX_BODY_BYTES) {
    respond(413, ['ok' => false, 'error' => 'payload_too_large']);
}

$rawBody = file_get_contents('php://input');
if (!is_string($rawBody) || strlen($rawBody) > LEAD_MAX_BODY_BYTES) {
    respond(413, ['ok' => false, 'error' => 'payload_too_large']);
}

$payload = json_decode($rawBody, true);
if (!is_array($payload)) {
    respond(400, ['ok' => false, 'error' => 'invalid_json']);
}

$website = cleanText($payload['website'] ?? '', 200);
if ($website !== '') {
    respond(200, ['ok' => true]);
}

$lead = [
    'kind' => cleanLine($payload['kind'] ?? '', 32),
    'name' => cleanLine($payload['name'] ?? '', 120),
    'phone' => cleanLine($payload['phone'] ?? '', 80),
    'area' => cleanLine($payload['area'] ?? '', 24),
    'premises' => cleanLine($payload['premises'] ?? '', 48),
    'package' => cleanLine($payload['package'] ?? '', 64),
    'comment' => cleanText($payload['comment'] ?? '', 2800),
    'locale' => cleanLine($payload['locale'] ?? '', 16),
    'page' => cleanLine($payload['page'] ?? '', 300),
];
$submissionId = cleanLine($payload['submissionId'] ?? '', 80);
$consent = ($payload['consent'] ?? false) === true;

$digits = preg_replace('/\D+/', '', $lead['phone']);
$valid = in_array($lead['kind'], ['project', 'consultation'], true)
    && $consent
    && preg_match('/^[A-Za-z0-9-]{16,80}$/', $submissionId) === 1
    && strlen($lead['name']) >= 2
    && is_string($digits)
    && strlen($digits) >= 10
    && strlen($digits) <= 18;

if ($lead['kind'] === 'project') {
    $valid = $valid
        && is_numeric($lead['area'])
        && (float) $lead['area'] > 0
        && (float) $lead['area'] <= 100000
        && in_array($lead['premises'], ['apartment', 'house', 'office'], true)
        && in_array(
            $lead['package'],
            [
                'unknown',
                'planning',
                'collages',
                'full',
                'planViz',
                'electric',
                'viz3d',
                'procurement',
                'supervision',
                'ergonomics',
                'prelaunch',
            ],
            true,
        );
}

if (!$valid) {
    respond(422, ['ok' => false, 'error' => 'validation_failed']);
}

$stateHandle = false;
try {
    $config = loadDeliveryConfig();
    $recipients = deliveryRecipients($config);
    $ip = is_string($_SERVER['REMOTE_ADDR'] ?? null) ? $_SERVER['REMOTE_ADDR'] : 'unknown';
    if (isRateLimited($ip)) {
        header('Retry-After: ' . LEAD_RATE_WINDOW_SECONDS);
        respond(429, ['ok' => false, 'error' => 'rate_limited']);
    }
    $stateHandle = openDeliveryState($submissionId);
    if ($stateHandle === false) {
        respond(503, ['ok' => false, 'error' => 'submission_busy']);
    }
} catch (Throwable $error) {
    error_log('[lead] Delivery setup failed: ' . $error->getMessage());
    respond(503, ['ok' => false, 'error' => 'delivery_unavailable']);
}

ignore_user_abort(true);
@set_time_limit(35);
$deadline = microtime(true) + LEAD_DELIVERY_TIMEOUT_SECONDS;
date_default_timezone_set('Europe/Moscow');
$requestId = $submissionId;
$message = buildLeadMessage($lead, $requestId);
$fingerprint = hash('sha256', (string) json_encode($lead));
try {
    $failures = deliverLeadRecipients(
        $stateHandle,
        $recipients,
        $fingerprint,
        static function (array $recipient) use ($config, $message, $deadline): void {
            sendTelegram($config['telegramBotToken'], $recipient['target'], $message, $deadline);
        },
    );
} catch (DomainException $error) {
    respond(409, ['ok' => false, 'error' => 'submission_conflict', 'requestId' => $requestId]);
} catch (Throwable $error) {
    error_log('[lead:' . $requestId . '] Delivery state failed');
    respond(503, ['ok' => false, 'error' => 'delivery_unavailable', 'requestId' => $requestId]);
} finally {
    flock($stateHandle, LOCK_UN);
    fclose($stateHandle);
}

if ($failures !== []) {
    respond(502, ['ok' => false, 'error' => 'delivery_failed', 'requestId' => $requestId]);
}

respond(200, ['ok' => true, 'requestId' => $requestId]);
}

if (realpath($_SERVER['SCRIPT_FILENAME'] ?? '') === __FILE__) {
    handleLeadRequest();
}
