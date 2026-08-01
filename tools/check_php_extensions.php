<?php

declare(strict_types=1);

$required = [
    'mbstring',
    'openssl',
    'PDO',
    'pdo_sqlite',
    'sqlite3',
    'fileinfo',
];

$missing = [];

foreach ($required as $extension) {
    if (! extension_loaded($extension)) {
        $missing[] = $extension;
    }
}

if ($missing !== []) {
    foreach ($missing as $extension) {
        fwrite(STDERR, "Missing extension: {$extension}" . PHP_EOL);
    }

    exit(1);
}

echo 'All required PHP extensions are enabled.' . PHP_EOL;
