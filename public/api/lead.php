<?php

declare(strict_types=1);

const LEAD_EMAIL_DEFAULT = 'dizain.seichas@yandex.ru';
const LEAD_MAX_BODY_BYTES = 32768;
const LEAD_RATE_LIMIT = 5;
const LEAD_RATE_WINDOW_SECONDS = 600;

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
    $path = sys_get_temp_dir() . '/design-seichas-leads-' . hash('sha256', $ip) . '.json';
    $handle = @fopen($path, 'c+');
    if ($handle === false || !flock($handle, LOCK_EX)) {
        if (is_resource($handle)) {
            fclose($handle);
        }
        return false;
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
    $path = sys_get_temp_dir() . '/design-seichas-delivery-' . hash('sha256', $submissionId) . '.json';
    $handle = @fopen($path, 'c+');
    if ($handle === false || !flock($handle, LOCK_EX)) {
        if (is_resource($handle)) {
            fclose($handle);
        }
        return false;
    }
    return $handle;
}

/** @param resource $handle @return array{email: bool, telegram: bool} */
function readDeliveryState($handle): array
{
    rewind($handle);
    $raw = stream_get_contents($handle);
    $decoded = is_string($raw) && $raw !== '' ? json_decode($raw, true) : null;
    return [
        'email' => is_array($decoded) && ($decoded['email'] ?? false) === true,
        'telegram' => is_array($decoded) && ($decoded['telegram'] ?? false) === true,
    ];
}

/** @param resource $handle @param array{email: bool, telegram: bool} $state */
function writeDeliveryState($handle, array $state): void
{
    rewind($handle);
    ftruncate($handle, 0);
    fwrite(
        $handle,
        (string) json_encode([
            'email' => $state['email'],
            'telegram' => $state['telegram'],
            'updatedAt' => time(),
        ]),
    );
    fflush($handle);
}

/** @return array{smtpPassword: string, telegramBotToken: string, telegramChatId: string} */
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
        'smtpPassword' => $read('LEAD_SMTP_PASSWORD', 'smtpPassword'),
        'telegramBotToken' => $read('LEAD_TELEGRAM_BOT_TOKEN', 'telegramBotToken'),
        'telegramChatId' => $read('LEAD_TELEGRAM_CHAT_ID', 'telegramChatId'),
    ];
}

/** @param resource $socket */
function smtpRead($socket, array $expectedCodes): void
{
    $response = '';
    while (($line = fgets($socket, 1024)) !== false) {
        $response .= $line;
        if (strlen($line) >= 4 && $line[3] === ' ') {
            break;
        }
    }

    $code = (int) substr($response, 0, 3);
    if (!in_array($code, $expectedCodes, true)) {
        throw new RuntimeException('SMTP rejected a command with status ' . $code);
    }
}

/** @param resource $socket */
function smtpCommand($socket, string $command, array $expectedCodes): void
{
    if (fwrite($socket, $command . "\r\n") === false) {
        throw new RuntimeException('SMTP write failed');
    }
    smtpRead($socket, $expectedCodes);
}

function sendEmail(string $password, string $subject, string $message, string $requestId): void
{
    $context = stream_context_create([
        'ssl' => [
            'verify_peer' => true,
            'verify_peer_name' => true,
            'peer_name' => 'smtp.yandex.ru',
        ],
    ]);
    $errorNumber = 0;
    $errorMessage = '';
    $socket = @stream_socket_client(
        'ssl://smtp.yandex.ru:465',
        $errorNumber,
        $errorMessage,
        10,
        STREAM_CLIENT_CONNECT,
        $context,
    );

    if ($socket === false) {
        throw new RuntimeException('SMTP connection failed with status ' . $errorNumber);
    }

    stream_set_timeout($socket, 10);

    try {
        smtpRead($socket, [220]);
        smtpCommand($socket, 'EHLO designseichas.ru', [250]);
        smtpCommand($socket, 'AUTH LOGIN', [334]);
        smtpCommand($socket, base64_encode(LEAD_EMAIL_DEFAULT), [334]);
        smtpCommand($socket, base64_encode($password), [235]);
        smtpCommand($socket, 'MAIL FROM:<' . LEAD_EMAIL_DEFAULT . '>', [250]);
        smtpCommand($socket, 'RCPT TO:<' . LEAD_EMAIL_DEFAULT . '>', [250, 251]);
        smtpCommand($socket, 'DATA', [354]);

        $encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
        $encodedFrom = '=?UTF-8?B?' . base64_encode('ДизайнСейчас · сайт') . '?=';
        $headers = [
            'Date: ' . date(DATE_RFC2822),
            'From: ' . $encodedFrom . ' <' . LEAD_EMAIL_DEFAULT . '>',
            'To: <' . LEAD_EMAIL_DEFAULT . '>',
            'Subject: ' . $encodedSubject,
            'Message-ID: <' . $requestId . '@designseichas.ru>',
            'MIME-Version: 1.0',
            'Content-Type: text/plain; charset=UTF-8',
            'Content-Transfer-Encoding: base64',
        ];
        $data = implode("\r\n", $headers) . "\r\n\r\n";
        $data .= chunk_split(base64_encode($message), 76, "\r\n");
        $data .= ".\r\n";

        if (fwrite($socket, $data) === false) {
            throw new RuntimeException('SMTP message write failed');
        }
        smtpRead($socket, [250]);
        smtpCommand($socket, 'QUIT', [221]);
    } finally {
        fclose($socket);
    }
}

function sendTelegram(string $token, string $chatId, string $message): void
{
    if (!preg_match('/^\d+:[A-Za-z0-9_-]{30,}$/', $token)) {
        throw new RuntimeException('Telegram bot token has an invalid format');
    }
    if (!preg_match('/^(?:-?\d+|@[A-Za-z][A-Za-z0-9_]{4,31})$/', $chatId)) {
        throw new RuntimeException('Telegram chat id has an invalid format');
    }

    $url = 'https://api.telegram.org/bot' . $token . '/sendMessage';
    $payload = (string) json_encode(
        ['chat_id' => $chatId, 'text' => $message, 'disable_web_page_preview' => true],
        JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES,
    );

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
            CURLOPT_CONNECTTIMEOUT => 5,
            CURLOPT_TIMEOUT => 10,
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
                'timeout' => 10,
                'ignore_errors' => true,
            ],
        ]);
        $response = @file_get_contents($url, false, $context);
        $statusLine = $http_response_header[0] ?? '';
        preg_match('/\s(\d{3})\s/', $statusLine, $matches);
        $status = isset($matches[1]) ? (int) $matches[1] : 0;
    }

    $decoded = is_string($response) ? json_decode($response, true) : null;
    if ($status < 200 || $status >= 300 || !is_array($decoded) || ($decoded['ok'] ?? false) !== true) {
        throw new RuntimeException('Telegram rejected the message with status ' . $status);
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

$ip = is_string($_SERVER['REMOTE_ADDR'] ?? null) ? $_SERVER['REMOTE_ADDR'] : 'unknown';
if (isRateLimited($ip)) {
    respond(429, ['ok' => false, 'error' => 'rate_limited']);
}

$config = loadDeliveryConfig();
if ($config['smtpPassword'] === '' || $config['telegramBotToken'] === '' || $config['telegramChatId'] === '') {
    error_log('[lead] Delivery configuration is incomplete');
    respond(503, ['ok' => false, 'error' => 'delivery_unavailable']);
}

date_default_timezone_set('Europe/Moscow');
$requestId = $submissionId;
$message = buildLeadMessage($lead, $requestId);
$subject = ($lead['kind'] === 'project' ? 'Заявка на проект' : 'Заявка на консультацию')
    . ' — ' . $lead['name'];
$failures = [];
$stateHandle = openDeliveryState($submissionId);
$state = $stateHandle !== false
    ? readDeliveryState($stateHandle)
    : ['email' => false, 'telegram' => false];

if (!$state['email']) {
    try {
        sendEmail($config['smtpPassword'], $subject, $message, $requestId);
        $state['email'] = true;
        if ($stateHandle !== false) {
            writeDeliveryState($stateHandle, $state);
        }
    } catch (Throwable $error) {
        error_log('[lead:' . $requestId . '] Email delivery failed: ' . $error->getMessage());
        $failures[] = 'email';
    }
}

if (!$state['telegram']) {
    try {
        sendTelegram($config['telegramBotToken'], $config['telegramChatId'], $message);
        $state['telegram'] = true;
        if ($stateHandle !== false) {
            writeDeliveryState($stateHandle, $state);
        }
    } catch (Throwable $error) {
        error_log('[lead:' . $requestId . '] Telegram delivery failed: ' . $error->getMessage());
        $failures[] = 'telegram';
    }
}

if ($stateHandle !== false) {
    flock($stateHandle, LOCK_UN);
    fclose($stateHandle);
}

if ($failures !== []) {
    respond(502, ['ok' => false, 'error' => 'delivery_failed', 'requestId' => $requestId]);
}

respond(200, ['ok' => true, 'requestId' => $requestId]);
