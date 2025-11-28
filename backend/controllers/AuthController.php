<?php
require_once __DIR__ . '/../models/Admin.php';
require_once __DIR__ . '/../utils/Validator.php';
require_once __DIR__ . '/../utils/Response.php';

class AuthController {
    private $db;
    private $userModel;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->userModel = new Admin($this->db);
    }

    public function register() {
        $data = json_decode(file_get_contents("php://input"), true);

        // Basic validation
        if (empty($data['username']) || empty($data['email']) || empty($data['password'])) {
            Response::error("All fields are required", 400);
        }

        // Check username exists
        if ($this->userModel->findByUsername($data['username'])) {
            Response::error("Username already exists", 409);
        }

        // Hash password
        $data['password'] = password_hash($data['password'], PASSWORD_BCRYPT);

        $userId = $this->userModel->create($data);

        if ($userId) {
            Response::success(["user_id" => $userId], "Admin account created");
        } else {
            Response::error("Failed to create admin", 500);
        }
    }

    public function login() {
        $data = json_decode(file_get_contents("php://input"), true);

        if (empty($data['username']) || empty($data['password'])) {
            Response::error("Username and password are required", 400);
        }

        $user = $this->userModel->findByUsername($data['username']);

        if (!$user || !password_verify($data['password'], $user['password'])) {
            Response::error("Invalid credentials", 401);
        }

        $token = JWT::encode([
            'user_id' => $user['id'],
            'username' => $user['username']
        ]);

        Response::success([
            "token" => $token,
            "user" => [
                "id" => $user['id'],
                "username" => $user['username'],
                "email" => $user['email']
            ]
        ], "Login successful");
    }

    public function me() {
        $currentUser = $GLOBALS['current_user'];

        $user = $this->userModel->findById($currentUser['user_id']);

        if ($user) {
            Response::success(["user" => $user]);
        } else {
            Response::error("User not found", 404);
        }
    }
}
