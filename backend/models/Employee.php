<?php

class Employee {
    private $conn;
    private $table = 'employees';

    public function __construct($db) {
        $this->conn = $db;
    }

    // Fetch all employees
    public function getAll() {
        $query = "SELECT * FROM {$this->table} ORDER BY name ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    // Fetch single employee
    public function getById($id) {
        $query = "SELECT * FROM {$this->table} WHERE id = :id LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        return $stmt->fetch();
    }

    // Create new employee
    public function create($data) {
        $query = "INSERT INTO {$this->table}
                  (first_name,
                   middle_name,
                   last_name,
                   birthday,
                   gender,
                   civil_status,
                   email_address,
                   phone_number,
                   address,
                   position,
                   department,
                   employee_status,
                   entrance_duty,
                   gsis_policy_number,
                   tin_number,
                   national_reference_card_no,
                   sss_number,
                   philhealth_number,
                   pagibig_number)
                  VALUES
                  (:first_name,
                   :middle_name,
                   :last_name,
                   :birthday,
                   :gender,
                   :civil_status,
                   :email_address,
                   :phone_number,
                   :address,
                   :position,
                   :department,
                   :employment_status,
                   :entrance_to_duty,
                   :gsis_policy_number,
                   :tin_number,
                   :national_reference_card_no,
                   :sss_number,
                   :philhealth_number,
                   :pagibig_number)";

        $stmt = $this->conn->prepare($query);

        // Personal Info
        $stmt->bindParam(':first_name', $data['first_name']);
        $middle_name = $data['middle_name'] ?? null;
        $stmt->bindParam(':middle_name', $middle_name);
        $stmt->bindParam(':last_name', $data['last_name']);
        $stmt->bindParam(':birthday', $data['birthday']);
        $stmt->bindParam(':gender', $data['gender']);
        $stmt->bindParam(':civil_status', $data['civil_status']);

        // Contact Info
        $stmt->bindParam(':email_address', $data['email_address']);
        $phone_number = $data['phone_number'] ?? null;
        $stmt->bindParam(':phone_number', $phone_number);
        $stmt->bindParam(':address', $data['address']);

        // Employment Details
        $stmt->bindParam(':position', $data['position']);
        $stmt->bindParam(':department', $data['department']);
        $stmt->bindParam(':employment_status', $data['employment_status']);
        $stmt->bindParam(':entrance_to_duty', $data['entrance_to_duty']);

        // Government IDs
        $gsis = $data['gsis_policy_number'] ?? null;
        $stmt->bindParam(':gsis_policy_number', $gsis);
        $tin = $data['tin_number'] ?? null;
        $stmt->bindParam(':tin_number', $tin);
        $nrc = $data['national_reference_card_no'] ?? null;
        $stmt->bindParam(':national_reference_card_no', $nrc);
        $sss = $data['sss_number'] ?? null;
        $stmt->bindParam(':sss_number', $sss);
        $philhealth = $data['philhealth_number'] ?? null;
        $stmt->bindParam(':philhealth_number', $philhealth);
        $pagibig = $data['pagibig_number'] ?? null;
        $stmt->bindParam(':pagibig_number', $pagibig);

        try {
            if ($stmt->execute()) {
                return $this->conn->lastInsertId();
            }
        } catch (PDOException $e) {
            error_log("Employee Creation Error: " . $e->getMessage());
            throw new Exception("Failed to create employee: " . $e->getMessage());
        }

        return false;
    }

    public function update($id, $data) {
        $query = "UPDATE {$this->table}
                  SET name = :name,
                      position = :position,
                      employment_status = :employment_status,
                      civil_status = :civil_status,
                      entrance_to_duty = :entrance_to_duty,
                      gsis_policy_number = :gsis_policy_number,
                      tin_number = :tin_number,
                      national_reference_card_no = :national_reference_card_no
                  WHERE id = :id";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':name', $data['name']);
        $stmt->bindParam(':position', $data['position']);
        $stmt->bindParam(':employment_status', $data['employment_status']);
        $stmt->bindParam(':civil_status', $data['civil_status']);
        $stmt->bindParam(':entrance_to_duty', $data['entrance_to_duty']);
        $stmt->bindParam(':gsis_policy_number', $data['gsis_policy_number']);
        $stmt->bindParam(':tin_number', $data['tin_number']);
        $stmt->bindParam(':national_reference_card_no', $data['national_reference_card_no']);

        return $stmt->execute();
    }

    // Delete employee (hard delete—pwede soft delete if gusto mo)
    public function delete($id) {
        $query = "DELETE FROM {$this->table} WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    }
}
