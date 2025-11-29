<?php
class Admin {
    private $conn;
    private $table = "admins";

    public function __construct($db) {
        $this->conn = $db;
    }

    public function findByUsername($username) {
        $query = "SELECT * FROM " . $this->table . " WHERE username = :username LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":username", $username);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function findById($id) {
        $query = "SELECT id, username, email, created_at
                  FROM " . $this->table . "
                  WHERE id = :id LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $id);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function create($data) {
        $query = "INSERT INTO " . $this->table . "
                  (username, password, email)
                  VALUES (:username, :password, :email)";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":username", $data['username']);
        $stmt->bindParam(":password", $data['password']);
        $stmt->bindParam(":email", $data['email']);

        if ($stmt->execute()) {
            return $this->conn->lastInsertId();
        }

        return false;
    }
}
