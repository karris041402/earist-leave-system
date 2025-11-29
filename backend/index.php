<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/config/Database.php';
require_once __DIR__ . '/utils/JWT.php';
require_once __DIR__ . '/utils/Response.php';
require_once __DIR__ . '/utils/Validator.php';
require_once __DIR__ . '/middleware/AuthMiddleware.php';
require_once __DIR__ . '/routes/api.php';

// Parse request - Support both URL rewriting and query parameters
$uri = isset($_GET['route']) ? '/' . $_GET['route'] : parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

// If we have query parameters, build the API path
if (isset($_GET['route'])) {
    $route = $_GET['route'];
    $action = isset($_GET['action']) ? $_GET['action'] : '';

    // Map route and action to API endpoint
    if ($action) {
        $uri = '/api/' . $route . '/' . $action;
    } else {
        $uri = '/api/' . $route;
    }
}

// Remove base path from URI if present
$uri = str_replace('/backend', '', $uri);
$uri = str_replace('/index.php', '', $uri);
$uri = rtrim($uri, '/');

if (empty($uri)) {
    Response::error('No route specified', 400);
    exit;
}

// Debug log
error_log("DEBUG: Full REQUEST_URI = " . $_SERVER['REQUEST_URI']);
error_log("DEBUG: Parsed URI = " . $uri);
error_log("DEBUG: Method = " . $method);

// Route request
try {
    $router = new Router();
    $router->route($method, $uri);
} catch (Exception $e) {
    Response::error($e->getMessage(), 500);
}
