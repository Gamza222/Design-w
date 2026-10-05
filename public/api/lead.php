<?php

declare(strict_types=1);

const LEAD_MAX_BODY_BYTES = 32768;
const LEAD_RATE_LIMIT = 5;
const LEAD_RATE_WINDOW_SECONDS = 600;
const LEAD_DELIVERY_TIMEOUT_SECONDS = 24;
const LEAD_NUMBER_ALPHABET = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';
const LEAD_NUMBER_LENGTH = 9;

final class LeadStateLock
{
    /** @var resource */
    public $handle;
    /** @var resource|null */
    public $legacyHandle;
    public string $directory;
    public string $submissionHash;
    public string $path;

    /** @param resource $handle @param resource|null $legacyHandle */
    public function __construct($handle, string $directory, string $submissionHash, $legacyHandle = null)
    {
        $this->handle = $handle;
        $this->legacyHandle = $legacyHandle;
        $this->directory = $directory;
        $this->submissionHash = $submissionHash;
        $this->path = $directory . '/deliveries/' . $submissionHash . '.json';
    }
}

function ensurePrivateDirectory(string $directory): void
{
    if (!is_dir($directory) && !@mkdir($directory, 0700, true) && !is_dir($directory)) {
        throw new RuntimeException('Delivery state directory is unavailable');
    }
    if (is_link($directory) || !is_writable($directory) || !@chmod($directory, 0700)) {
        throw new RuntimeException('Delivery state directory is not private and writable');
    }
}

/** @param array<string, string>|null $config */
function stateDirectory(?array $config = null): string
{
    $config = $config ?? loadDeliveryConfig();
    // A sibling of the document root: deploy's mirror --delete never visits it.
    $configured = $config['stateDirectory'] ?? '';
    $directory = rtrim($configured, '/');
    if ($configured === '') {
        $directory = dirname(__DIR__, 2) . '/.designseichas-leads';
    }
    if ($directory === '' || $directory[0] !== '/' || preg_match('~[\x00-\x1f\\\\]|/(?:\.|\.\.)(?:/|$)~', $directory)) {
        throw new RuntimeException('Delivery state needs an absolute persistent path');
    }
    $resolved = realpath($directory);
    $directory = $resolved !== false ? $resolved : $directory;
    $documentRoot = realpath(dirname(__DIR__)) ?: dirname(__DIR__);
    foreach ([$documentRoot, sys_get_temp_dir(), '/tmp', '/var/tmp', '/private/tmp', '/'] as $forbidden) {
        $forbidden = rtrim($forbidden, '/');
        if ($directory === $forbidden || ($forbidden !== '' && strpos($directory . '/', $forbidden . '/') === 0)) {
            throw new RuntimeException('Delivery state must stay outside web and temporary directories');
        }
    }
    ensurePrivateDirectory($directory);
    foreach (['locks', 'deliveries', 'numbers', 'rate'] as $child) {
        ensurePrivateDirectory($directory . '/' . $child);
    }
    return $directory;
}

function legacyStateDirectory(): string
{
    return sys_get_temp_dir() . '/design-seichas-' . substr(hash('sha256', __DIR__), 0, 16);
}

function syncStateDirectory(string $directory): void
{
    if (!function_exists('fsync')) {
        return;
    }
    $handle = @fopen($directory, 'r');
    if ($handle === false) {
        throw new RuntimeException('Delivery directory could not be synced');
    }
    try {
        if (!@fsync($handle)) {
            throw new RuntimeException('Delivery directory could not be synced');
        }
    } finally {
        fclose($handle);
    }
}

/** @param array<string, mixed>|array<int, int> $data */
function writeAtomicJson(string $path, array $data): void
{
    $json = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR);
    $temporary = dirname($path) . '/.pending-' . bin2hex(random_bytes(12));
    $handle = @fopen($temporary, 'x+b');
    if ($handle === false) {
        throw new RuntimeException('Delivery state could not be created');
    }
    try {
        if (!@chmod($temporary, 0600) || fwrite($handle, $json) !== strlen($json) || !fflush($handle)) {
            throw new RuntimeException('Delivery state could not be saved');
        }
        // PHP 7.4 is supported; PHP 8.1+ also flushes file data to the filesystem.
        if (function_exists('fsync') && !fsync($handle)) {
            throw new RuntimeException('Delivery state could not be synced');
        }
        fclose($handle);
        $handle = null;
        if (!@rename($temporary, $path)) {
            throw new RuntimeException('Delivery state could not be committed');
        }
        syncStateDirectory(dirname($path));
    } finally {
        if (is_resource($handle)) {
            fclose($handle);
        }
        if (is_file($temporary)) {
            @unlink($temporary);
        }
    }
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

function isRateLimited(string $ip, ?string $directory = null): bool
{
    $directory = $directory ?? stateDirectory();
    $path = $directory . '/rate/' . hash('sha256', $ip) . '.json';
    $handle = @fopen($directory . '/locks/rate-' . hash('sha256', $ip) . '.lock', 'c+b');
    if ($handle === false || !flock($handle, LOCK_EX)) {
        if (is_resource($handle)) {
            fclose($handle);
        }
        throw new RuntimeException('Rate limit storage is unavailable');
    }

    try {
        $raw = is_file($path) ? @file_get_contents($path) : '';
        if (!is_string($raw)) {
            throw new RuntimeException('Rate limit storage is unreadable');
        }
        $decoded = $raw !== '' ? json_decode($raw, true) : [];
        if (!is_array($decoded)) {
            throw new RuntimeException('Rate limit storage is unreadable');
        }
        $now = time();
        $threshold = $now - LEAD_RATE_WINDOW_SECONDS;
        $hits = [];
        foreach ($decoded as $timestamp) {
            if (!is_int($timestamp)) {
                throw new RuntimeException('Rate limit storage is unreadable');
            }
            if ($timestamp > $threshold) {
                $hits[] = $timestamp;
            }
        }

        $limited = count($hits) >= LEAD_RATE_LIMIT;
        if (!$limited) {
            $hits[] = $now;
            writeAtomicJson($path, $hits);
        }
        return $limited;
    } finally {
        flock($handle, LOCK_UN);
        fclose($handle);
    }
}

function openDeliveryState(string $submissionId, ?string $directory = null): ?LeadStateLock
{
    $legacyDirectory = $directory === null ? legacyStateDirectory() : null;
    return openDeliveryStateByHash(hash('sha256', $submissionId), $directory ?? stateDirectory(), $legacyDirectory);
}

function openDeliveryStateByHash(string $hash, string $directory, ?string $legacyDirectory = null): ?LeadStateLock
{
    if (preg_match('/^[a-f0-9]{64}$/', $hash) !== 1) {
        throw new InvalidArgumentException('Invalid submission hash');
    }
    $handle = @fopen($directory . '/locks/delivery-' . $hash . '.lock', 'c+b');
    if ($handle === false) {
        throw new RuntimeException('Delivery lock could not be opened');
    }
    @chmod($directory . '/locks/delivery-' . $hash . '.lock', 0600);
    if (!flock($handle, LOCK_EX | LOCK_NB)) {
        fclose($handle);
        return null;
    }
    $legacyHandle = null;
    $legacyPath = ($legacyDirectory ?? '') . '/delivery-' . $hash . '.json';
    if ($legacyDirectory !== null && is_file($legacyPath)) {
        $legacyHandle = @fopen($legacyPath, 'rb');
        if ($legacyHandle === false || !flock($legacyHandle, LOCK_EX | LOCK_NB)) {
            if (is_resource($legacyHandle)) {
                fclose($legacyHandle);
            }
            flock($handle, LOCK_UN);
            fclose($handle);
            throw new RuntimeException('Previous delivery state is unavailable or busy');
        }
    }
    return new LeadStateLock($handle, $directory, $hash, $legacyHandle);
}

function closeDeliveryState(LeadStateLock $lock): void
{
    foreach ([$lock->legacyHandle, $lock->handle] as $handle) {
        if (is_resource($handle)) {
            flock($handle, LOCK_UN);
            fclose($handle);
        }
    }
}

/** @return array<string, mixed> */
function readDeliveryState(LeadStateLock $lock): array
{
    $legacy = false;
    if (is_file($lock->path)) {
        $raw = @file_get_contents($lock->path);
    } elseif (is_resource($lock->legacyHandle)) {
        rewind($lock->legacyHandle);
        $raw = stream_get_contents($lock->legacyHandle);
        $legacy = true;
        if ($raw === '') {
            return ['fingerprint' => '', 'delivered' => []];
        }
    } else {
        return ['fingerprint' => '', 'delivered' => []];
    }
    $decoded = is_string($raw) ? json_decode($raw, true) : null;
    if (!is_array($decoded) || !is_string($decoded['fingerprint'] ?? null)
        || preg_match('/^[a-f0-9]{64}$/', $decoded['fingerprint']) !== 1
        || !is_array($decoded['delivered'] ?? null)
        || (!$legacy && (($decoded['version'] ?? null) !== 1 || !isLeadNumber($decoded['leadNumber'] ?? null)
            || !is_int($decoded['createdAt'] ?? null)))) {
        throw new RuntimeException('Delivery state is unreadable');
    }
    foreach ($decoded['delivered'] as $key => $value) {
        if (!is_string($key) || preg_match('/^telegram:[a-f0-9]{64}$/', $key) !== 1 || $value !== true) {
            throw new RuntimeException('Delivery confirmation is unreadable');
        }
    }
    if (!$legacy) {
        $owner = @file_get_contents($lock->directory . '/numbers/' . $decoded['leadNumber']);
        if (!is_string($owner) || !hash_equals($lock->submissionHash, $owner)) {
            throw new RuntimeException('Lead number registry is inconsistent');
        }
    }
    return $decoded;
}

/** @param array<string, mixed> $state */
function writeDeliveryState(LeadStateLock $lock, array $state): void
{
    $state['version'] = 1;
    $state['updatedAt'] = time();
    writeAtomicJson($lock->path, $state);
}

function isLeadNumber($number): bool
{
    return is_string($number) && preg_match('/^[' . LEAD_NUMBER_ALPHABET . ']{' . LEAD_NUMBER_LENGTH . '}$/', $number) === 1;
}

function generateLeadNumber(): string
{
    $number = '';
    for ($index = 0; $index < LEAD_NUMBER_LENGTH; $index++) {
        $number .= LEAD_NUMBER_ALPHABET[random_int(0, strlen(LEAD_NUMBER_ALPHABET) - 1)];
    }
    return $number;
}

function reserveLeadNumber(LeadStateLock $lock, ?callable $generate = null): string
{
    $generate = $generate ?? 'generateLeadNumber';
    for ($attempt = 0; $attempt < 64; $attempt++) {
        $number = $generate();
        if (!isLeadNumber($number)) {
            throw new RuntimeException('Invalid public lead number');
        }
        // Exclusive creation is the uniqueness constraint, including across PHP workers.
        $path = $lock->directory . '/numbers/' . $number;
        $handle = @fopen($path, 'x+b');
        if ($handle === false) {
            if (file_exists($path)) {
                continue;
            }
            throw new RuntimeException('Lead number could not be reserved');
        }
        try {
            if (!@chmod($path, 0600) || fwrite($handle, $lock->submissionHash) !== 64 || !fflush($handle)
                || (function_exists('fsync') && !fsync($handle))) {
                throw new RuntimeException('Lead number could not be saved');
            }
        } finally {
            fclose($handle);
        }
        syncStateDirectory(dirname($path));
        // Failed/crashed allocations remain reserved: a public number is never recycled.
        return $number;
    }
    throw new RuntimeException('Lead number collision limit reached');
}

/** @return array<string, mixed> */
function prepareDeliveryState(LeadStateLock $lock, string $fingerprint, ?callable $generate = null): array
{
    $state = readDeliveryState($lock);
    if ($state['fingerprint'] !== '' && !hash_equals($state['fingerprint'], $fingerprint)) {
        throw new DomainException('Submission ID belongs to different lead details');
    }
    if (!isset($state['leadNumber'])) {
        $state['leadNumber'] = reserveLeadNumber($lock, $generate);
        $state['createdAt'] = $state['updatedAt'] ?? time();
        $state['fingerprint'] = $fingerprint;
        writeDeliveryState($lock, $state);
    }
    return $state;
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
        'stateDirectory' => $read('LEAD_STATE_DIR', 'stateDirectory'),
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
 * @param array<int, array{channel: string, target: string}> $recipients
 * @return array<int, string>
 */
function deliverLeadRecipients(LeadStateLock $handle, array $recipients, string $fingerprint, callable $send): array
{
    $state = prepareDeliveryState($handle, $fingerprint);
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
            error_log('[lead:' . $state['leadNumber'] . '] Telegram delivery failed');
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

/** @return array<string, string> */
function leadPackageNames(): array
{
    return [
        'unknown' => 'Нужна помощь с выбором',
        'planning' => 'Планировка',
        'drawings' => 'Чертежи',
        'collages' => 'Чертежи + коллажи',
        'full' => 'Полный дизайн-проект',
        'planViz' => 'Планировка + визуализации',
        'electric' => 'Планировка + электрика',
        'viz3d' => '3D-визуализации',
        'procurement' => 'Комплектация',
        'supervision' => 'Авторский надзор',
        'consultation' => 'Консультация',
    ];
}

/** @return array<string, mixed> */
function normalizeLeadContext($input): array
{
    if (!is_array($input) || !is_string($input['source'] ?? null)) {
        throw new InvalidArgumentException('Lead context requires a source');
    }
    $context = ['source' => cleanLine($input['source'], 100)];
    if ($context['source'] === '') {
        throw new InvalidArgumentException('Lead source is empty');
    }
    foreach (['service' => 160, 'project' => 160, 'packageId' => 64, 'packageName' => 160] as $key => $limit) {
        if (array_key_exists($key, $input)) {
            if (!is_string($input[$key]) || cleanLine($input[$key], $limit) === '') {
                throw new InvalidArgumentException('Invalid lead context text');
            }
            $context[$key] = cleanLine($input[$key], $limit);
        }
    }
    if (isset($context['packageId']) && !array_key_exists($context['packageId'], leadPackageNames())) {
        throw new InvalidArgumentException('Invalid package selection');
    }
    foreach (['area' => 100000, 'estimate' => 1000000000000] as $key => $maximum) {
        if (array_key_exists($key, $input)) {
            $value = $input[$key];
            if ((!is_int($value) && !is_float($value)) || !is_finite((float) $value)
                || $value < ($key === 'area' ? 0.01 : 0) || $value > $maximum) {
                throw new InvalidArgumentException('Invalid lead context number');
            }
            $context[$key] = round((float) $value, 2);
        }
    }
    if (array_key_exists('currency', $input)) {
        if (!in_array($input['currency'], ['RUB', 'BYN'], true)) {
            throw new InvalidArgumentException('Invalid estimate currency');
        }
        $context['currency'] = $input['currency'];
    }
    if (isset($context['estimate']) && !isset($context['currency'])) {
        throw new InvalidArgumentException('Estimate currency is required');
    }
    if (array_key_exists('preliminary', $input)) {
        if (!is_bool($input['preliminary'])) {
            throw new InvalidArgumentException('Invalid estimate qualifier');
        }
        $context['preliminary'] = $input['preliminary'];
    }
    if (array_key_exists('extras', $input)) {
        if (!is_array($input['extras']) || count($input['extras']) > 8
            || ($input['extras'] !== [] && array_keys($input['extras']) !== range(0, count($input['extras']) - 1))) {
            throw new InvalidArgumentException('Invalid extras');
        }
        $context['extras'] = [];
        foreach ($input['extras'] as $extra) {
            if (!is_string($extra) || cleanLine($extra, 160) === '') {
                throw new InvalidArgumentException('Invalid extra');
            }
            $context['extras'][] = cleanLine($extra, 160);
        }
        $context['extras'] = array_values(array_unique($context['extras']));
    }
    return $context;
}

/** @return array<string, string> */
function normalizeLeadAttribution($input): array
{
    if (!is_array($input)) {
        throw new InvalidArgumentException('Invalid attribution');
    }
    $attribution = [];
    foreach (['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'referrer'] as $key) {
        if (!array_key_exists($key, $input)) {
            continue;
        }
        if (!is_string($input[$key])) {
            throw new InvalidArgumentException('Invalid attribution value');
        }
        $value = cleanLine($input[$key], $key === 'referrer' ? 300 : 160);
        if ($key === 'referrer' && $value !== '') {
            $parts = parse_url($value);
            if (!is_array($parts) || !in_array($parts['scheme'] ?? '', ['http', 'https'], true)
                || !is_string($parts['host'] ?? null)) {
                throw new InvalidArgumentException('Invalid referrer');
            }
            // Query strings, fragments and credentials can contain unrelated personal data.
            $value = $parts['scheme'] . '://' . $parts['host'] . ($parts['path'] ?? '/');
        }
        if ($value !== '') {
            $attribution[$key] = $value;
        }
    }
    return $attribution;
}

/** @param array<string, mixed> $payload @return array<string, mixed> */
function normalizeLeadPayload(array $payload): array
{
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
    $submissionId = $payload['submissionId'] ?? '';
    $digits = preg_replace('/\D+/', '', $lead['phone']);
    $valid = in_array($lead['kind'], ['project', 'consultation'], true)
        && ($payload['consent'] ?? false) === true
        && is_string($submissionId)
        && preg_match('/^[A-Za-z0-9-]{16,80}$/', $submissionId) === 1
        && strlen($lead['name']) >= 2
        && is_string($digits) && strlen($digits) >= 10 && strlen($digits) <= 18
        && in_array($lead['locale'], ['', 'ru', 'en', 'by', 'be'], true);
    if ($lead['kind'] === 'project') {
        $valid = $valid && is_numeric($lead['area']) && is_finite((float) $lead['area'])
            && (float) $lead['area'] > 0 && (float) $lead['area'] <= 100000
            && in_array($lead['premises'], ['apartment', 'house', 'office'], true)
            && array_key_exists($lead['package'], leadPackageNames());
    }
    if (!$valid) {
        throw new InvalidArgumentException('Invalid lead details');
    }
    if (array_key_exists('context', $payload)) {
        $lead['context'] = normalizeLeadContext($payload['context']);
    }
    if (array_key_exists('attribution', $payload)) {
        $lead['attribution'] = normalizeLeadAttribution($payload['attribution']);
    }
    return $lead;
}

function textCharacterCount(string $text): int
{
    return (int) preg_match_all('/./us', $text);
}

function truncateCharacters(string $text, int $maximum): string
{
    if (textCharacterCount($text) <= $maximum) {
        return $text;
    }
    preg_match('/^.{0,' . max(0, $maximum - 1) . '}/us', $text, $matches);
    return ($matches[0] ?? '') . '…';
}

/** @param array<string, mixed> $lead */
function buildLeadMessage(array $lead, string $leadNumber, ?int $createdAt = null): string
{
    $premises = ['apartment' => 'Квартира', 'house' => 'Дом', 'office' => 'Коммерческое помещение'];
    $packages = leadPackageNames();
    $isProject = $lead['kind'] === 'project';
    $date = new DateTimeImmutable('@' . ($createdAt ?? time()));
    $lines = [
        $isProject ? 'Новая заявка на проект' : 'Новая заявка на консультацию',
        'Номер: ' . $leadNumber,
        'Дата: ' . $date->setTimezone(new DateTimeZone('Europe/Moscow'))->format('d.m.Y H:i') . ' (МСК)',
        '',
        'Имя: ' . $lead['name'],
        'Телефон: ' . $lead['phone'],
        'Согласие на обработку данных: получено',
    ];
    if ($isProject) {
        $lines[] = 'Объект: ' . ($premises[$lead['premises']] ?? $lead['premises']);
        $lines[] = 'Площадь: ' . $lead['area'] . ' м²';
        $lines[] = 'Услуга: ' . ($packages[$lead['package']] ?? $lead['package']);
    }
    $context = $lead['context'] ?? [];
    foreach (['source' => 'Источник', 'service' => 'Выбранная услуга', 'project' => 'Кейс'] as $key => $label) {
        if (isset($context[$key])) {
            $lines[] = $label . ': ' . $context[$key];
        }
    }
    if (isset($context['area'])) {
        $lines[] = 'Площадь в калькуляторе: ' . $context['area'] . ' м²';
    }
    if (isset($context['packageId'])) {
        $lines[] = 'Пакет: ' . ($packages[$context['packageId']] ?? $context['packageId']);
        if (isset($context['packageName']) && $context['packageName'] !== $packages[$context['packageId']]) {
            $lines[] = 'Название на сайте: ' . $context['packageName'];
        }
    } elseif (isset($context['packageName'])) {
        $lines[] = 'Пакет: ' . $context['packageName'];
    }
    if (($context['extras'] ?? []) !== []) {
        $lines[] = 'Дополнительно: ' . implode('; ', $context['extras']);
    }
    if (isset($context['estimate'])) {
        $lines[] = 'Предварительный расчёт с сайта: '
            . number_format($context['estimate'], $context['estimate'] == floor($context['estimate']) ? 0 : 2, ',', ' ')
            . ' ' . $context['currency'];
        if (($context['preliminary'] ?? false) === true) {
            $lines[] = 'В расчёте есть ставки «от» / услуги с уточнением стоимости.';
        }
        $lines[] = 'Стоимость и состав подтверждаются после обсуждения задачи.';
    }
    $lines[] = '';
    $lines[] = 'Язык сайта: ' . ($lead['locale'] !== '' ? $lead['locale'] : 'не указан');
    $lines[] = 'Страница: ' . ($lead['page'] !== '' ? $lead['page'] : '/');
    foreach ($lead['attribution'] ?? [] as $key => $value) {
        $lines[] = ($key === 'referrer' ? 'Переход с' : $key) . ': ' . $value;
    }
    $message = implode("\n", $lines);
    if ($lead['comment'] !== '') {
        $prefix = "\nКомментарий: ";
        $available = 4096 - textCharacterCount($message . $prefix);
        if ($available > 1) {
            $message .= $prefix . truncateCharacters($lead['comment'], $available);
        }
    }
    return truncateCharacters($message, 4096);
}

/**
 * Pure request orchestration: tests supply an isolated directory and fake Telegram sender.
 * @param array<string, mixed> $payload
 * @param array<string, string> $config
 * @return array{0: int, 1: array<string, mixed>}
 */
function processLeadPayload(array $payload, array $config, string $ip, callable $send, ?string $directory = null): array
{
    if (cleanText($payload['website'] ?? '', 200) !== '') {
        return [200, ['ok' => true]];
    }
    try {
        $lead = normalizeLeadPayload($payload);
    } catch (InvalidArgumentException $error) {
        return [422, ['ok' => false, 'error' => 'validation_failed']];
    }
    $lock = null;
    $numberResponse = [];
    try {
        $recipients = deliveryRecipients($config);
        $legacyDirectory = $directory === null ? legacyStateDirectory() : null;
        $directory = $directory ?? stateDirectory($config);
        $lock = openDeliveryStateByHash(hash('sha256', $payload['submissionId']), $directory, $legacyDirectory);
        if ($lock === null) {
            return [503, ['ok' => false, 'error' => 'submission_busy']];
        }
        $state = readDeliveryState($lock);
        $fingerprint = hash('sha256', (string) json_encode($lead));
        if ($state['fingerprint'] !== '' && !hash_equals($state['fingerprint'], $fingerprint)) {
            return [409, ['ok' => false, 'error' => 'submission_conflict']];
        }
        // A retry must remain recoverable even after the new-submission limit was reached.
        if ($state['fingerprint'] === '' && isRateLimited($ip, $directory)) {
            return [429, ['ok' => false, 'error' => 'rate_limited']];
        }
        $state = prepareDeliveryState($lock, $fingerprint);
        $numberResponse = ['leadNumber' => $state['leadNumber'], 'requestId' => $state['leadNumber']];
        $message = buildLeadMessage($lead, $state['leadNumber'], $state['createdAt']);
        $deadline = microtime(true) + LEAD_DELIVERY_TIMEOUT_SECONDS;
        $failures = deliverLeadRecipients($lock, $recipients, $fingerprint,
            static function (array $recipient) use ($config, $message, $deadline, $send): void {
                $send($config['telegramBotToken'], $recipient['target'], $message, $deadline);
            }
        );
        return $failures === []
            ? [200, ['ok' => true] + $numberResponse]
            : [502, ['ok' => false, 'error' => 'delivery_failed'] + $numberResponse];
    } catch (DomainException $error) {
        return [409, ['ok' => false, 'error' => 'submission_conflict']];
    } catch (Throwable $error) {
        error_log('[lead] Delivery configuration or state is unavailable');
        return [503, ['ok' => false, 'error' => 'delivery_unavailable'] + $numberResponse];
    } finally {
        if ($lock !== null) {
            closeDeliveryState($lock);
        }
    }
}

/** @return array{0: int, 1: array<string, mixed>} */
function leadHealth(?array $config = null, ?string $directory = null): array
{
    try {
        $config = $config ?? loadDeliveryConfig();
        $recipients = deliveryRecipients($config);
        $directory = $directory ?? stateDirectory($config);
        $probe = $directory . '/.health-' . bin2hex(random_bytes(8));
        writeAtomicJson($probe, ['at' => time()]);
        if (!@unlink($probe)) {
            throw new RuntimeException('Storage probe could not be removed');
        }
        return [200, ['ok' => true, 'storage' => 'ready', 'recipients' => count($recipients)]];
    } catch (Throwable $error) {
        return [503, ['ok' => false, 'error' => 'delivery_unavailable']];
    }
}

function handleLeadRequest(): void
{
    if (($_SERVER['REQUEST_METHOD'] ?? '') === 'GET' && ($_GET['health'] ?? '') === '1') {
        [$status, $body] = leadHealth();
        respond($status, $body);
    }
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
        header('Allow: POST');
        respond(405, ['ok' => false, 'error' => 'method_not_allowed']);
    }
    if (!isAllowedOrigin()) {
        respond(403, ['ok' => false, 'error' => 'origin_not_allowed']);
    }
    $contentType = $_SERVER['CONTENT_TYPE'] ?? '';
    if (!is_string($contentType) || preg_match('~^application/json(?:\s*;|$)~i', $contentType) !== 1) {
        respond(415, ['ok' => false, 'error' => 'unsupported_media_type']);
    }
    if ((int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > LEAD_MAX_BODY_BYTES) {
        respond(413, ['ok' => false, 'error' => 'payload_too_large']);
    }
    $rawBody = file_get_contents('php://input', false, null, 0, LEAD_MAX_BODY_BYTES + 1);
    if (!is_string($rawBody) || strlen($rawBody) > LEAD_MAX_BODY_BYTES) {
        respond(413, ['ok' => false, 'error' => 'payload_too_large']);
    }
    $payload = json_decode($rawBody, true);
    if (!is_array($payload)) {
        respond(400, ['ok' => false, 'error' => 'invalid_json']);
    }
    ignore_user_abort(true);
    @set_time_limit(35);
    $ip = is_string($_SERVER['REMOTE_ADDR'] ?? null) ? $_SERVER['REMOTE_ADDR'] : 'unknown';
    try {
        $config = loadDeliveryConfig();
    } catch (Throwable $error) {
        respond(503, ['ok' => false, 'error' => 'delivery_unavailable']);
    }
    [$status, $body] = processLeadPayload($payload, $config, $ip, 'sendTelegram');
    if ($status === 429) {
        header('Retry-After: ' . LEAD_RATE_WINDOW_SECONDS);
    }
    if ($status === 503 && ($body['error'] ?? '') === 'submission_busy') {
        header('Retry-After: 2');
    }
    respond($status, $body);
}

if (realpath($_SERVER['SCRIPT_FILENAME'] ?? '') === __FILE__) {
    handleLeadRequest();
}
