<?php
if (file_exists(__DIR__ . '/../.env')) {
    $lines = file(__DIR__ . '/../.env', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos($line, '=') !== false && strpos($line, '#') !== 0) {
            list($key, $value) = explode('=', $line, 2);
            $_ENV[trim($key)] = trim($value);
        }
    }
}

return [
    'db_host' => $_ENV['DB_HOST'] ?? 'localhost',
    'db_name' => $_ENV['DB_NAME'] ?? 'earisthr-leave-system',
    'db_user' => $_ENV['DB_USER'] ?? 'root',
    'db_pass' => $_ENV['DB_PASS'] ?? '',
    'jwt_secret' => $_ENV['JWT_SECRET'] ?? 'your-secret-key-change-this',
    'jwt_expiry' => $_ENV['JWT_EXPIRY'] ?? 3600, 
    'base_url' => $_ENV['BASE_URL'] ?? 'http://localhost',
    'cors_origin' => $_ENV['CORS_ORIGIN'] ?? '*'
];