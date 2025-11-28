<?php
class AuthMiddleware {
    public static function authenticate() {
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? '';
        
        if (empty($authHeader)) {
            Response::error('No token provided', 401);
        }
        
        $token = str_replace('Bearer ', '', $authHeader);
        $payload = JWT::decode($token);
        
        if (!$payload) {
            Response::error('Invalid or expired token', 401);
        }
        
        // Save logged-in user info for controllers
        $GLOBALS['current_user'] = $payload;
        
        return $payload;
    }
}
