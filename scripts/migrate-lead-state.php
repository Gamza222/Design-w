<?php

declare(strict_types=1);

// Run through CLI on the hosting/VPS, with the deployed handler as the first argument.
// Only number/fingerprint/confirmation records are copied; no Telegram requests are made.
if (PHP_SAPI !== 'cli') {
    http_response_code(404);
    exit;
}

try {
    $endpoint = $argv[1] ?? __DIR__ . '/../public/api/lead.php';
    if (!is_file($endpoint)) {
        throw new RuntimeException('Endpoint unavailable');
    }
    require $endpoint;
    $directory = stateDirectory();
    $legacy = $argv[2] ?? legacyStateDirectory();
    if (!is_dir($legacy)) {
        echo "No previous temporary lead state found. Nothing to migrate.\n";
        exit;
    }
    $migrated = 0;
    $busy = 0;
    foreach (glob($legacy . '/delivery-*.json') ?: [] as $path) {
        if (!preg_match('/^delivery-([a-f0-9]{64})\.json$/', basename($path), $match)) {
            continue;
        }
        $lock = openDeliveryStateByHash($match[1], $directory, $legacy);
        if ($lock === null) {
            $busy++;
            continue;
        }
        try {
            $state = readDeliveryState($lock);
            if ($state['fingerprint'] !== '') {
                prepareDeliveryState($lock, $state['fingerprint']);
                $migrated++;
            }
        } finally {
            closeDeliveryState($lock);
        }
    }
    echo "Durable records verified/migrated: $migrated; busy: $busy. No messages sent.\n";
    if ($busy > 0) {
        fwrite(STDERR, "Repeat after active requests finish; keep the previous directory until migration completes.\n");
        exit(2);
    }
} catch (Throwable $error) {
    // Filesystem errors may expose absolute account paths; keep operator output generic.
    fwrite(STDERR, "Migration failed. Check storage permissions and record integrity; keep both directories. No messages sent.\n");
    exit(1);
}
