<?php
require_once __DIR__ . '/../middleware/AuthMiddleware.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../controllers/AuthController.php';
require_once __DIR__ . '/../controllers/EmployeeController.php';

class Router {
    private $authController;
    private $employeeController;

    public function __construct() {
        $this->authController = new AuthController();
        $this->employeeController = new EmployeeController();
    }

    public function route($method, $uri) {
        // Normalize URI
        $uri = str_replace('/backend', '', $uri);
        $uri = rtrim($uri, '/');

        // =======================
        // AUTH ROUTES
        // =======================
        if ($uri === '/api/auth/login' && $method === 'POST') {
            return $this->authController->login();
        }

        if ($uri === '/api/auth/register' && $method === 'POST') {
            return $this->authController->register();
        }

        if ($uri === '/api/auth/me' && $method === 'GET') {
            AuthMiddleware::authenticate();
            return $this->authController->me();
        }

        // =======================
        // EMPLOYEE ROUTES
        // =======================
        if ($uri === '/api/employees' && $method === 'GET') {
            AuthMiddleware::authenticate();
            return $this->employeeController->index();
        }

        if (preg_match('/^\/api\/employees\/(\d+)$/', $uri, $matches) && $method === 'GET') {
            AuthMiddleware::authenticate();
            return $this->employeeController->show($matches[1]);
        }

        if ($uri === '/api/employees' && $method === 'POST') {
            AuthMiddleware::authenticate();
            return $this->employeeController->create();
        }

        if (preg_match('/^\/api\/employees\/(\d+)$/', $uri, $matches) && $method === 'PUT') {
            AuthMiddleware::authenticate();
            return $this->employeeController->update($matches[1]);
        }

        if (preg_match('/^\/api\/employees\/(\d+)$/', $uri, $matches) && $method === 'DELETE') {
            AuthMiddleware::authenticate();
            return $this->employeeController->delete($matches[1]);
        }

        // DEFAULT RESPONSE
        Response::error('Route not found', 404);
    }
}
