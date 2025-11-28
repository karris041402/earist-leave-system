<?php
require_once __DIR__ . '/../models/Employee.php';
require_once __DIR__ . '/../utils/Validator.php';
require_once __DIR__ . '/../utils/Response.php';

class EmployeeController {
    private $employeeModel;
    
    public function __construct() {
        $database = new Database();
        $db = $database->getConnection();
        $this->employeeModel = new Employee($db);
    }

    // GET /api/employees
    public function index() {
        $employees = $this->employeeModel->getAll();
        Response::success(['employees' => $employees]);
    }

    // GET /api/employees/{id}
    public function show($id) {
        $employee = $this->employeeModel->getById($id);

        if ($employee) {
            Response::success(['employee' => $employee]);
        } else {
            Response::error('Employee not found', 404);
        }
    }

    // POST /api/employees
    public function create() {
        $data = json_decode(file_get_contents("php://input"), true);

        // VALIDATION (based on your new employees table)
        $validator = new Validator();
        if (!$validator->validate($data, [
            'first_name' => 'required',
            'middle_name' => 'nullable',
            'last_name' => 'required',

            'birthday' => 'required|date',
            'gender' => 'required',
            'civil_status' => 'required',

            'email_address' => 'required|email',
            'phone_number' => 'required',
            'address' => 'required',

            'position' => 'required',
            'department' => 'required',
            'employment_status' => 'required',

            'entrance_to_duty' => 'required|date',

            // Government IDs
            'gsis_policy_number' => 'nullable',
            'tin_number' => 'nullable',
            'national_reference_card_no' => 'nullable',
            'sss_number' => 'nullable',
            'philhealth_number' => 'nullable',
            'pagibig_number' => 'nullable'
        ])) {
            Response::error('Validation failed', 400, $validator->getErrors());
        }

        // Create employee
        $employeeId = $this->employeeModel->create($data);

        if ($employeeId) {
            Response::success(
                ['employee_id' => $employeeId],
                'Employee created successfully',
                201
            );
        } else {
            Response::error('Failed to create employee', 500);
        }
    }

    // PUT /api/employees/{id}
    public function update($id) {
        $data = json_decode(file_get_contents("php://input"), true);

        if ($this->employeeModel->update($id, $data)) {
            Response::success([], 'Employee updated successfully');
        } else {
            Response::error('Failed to update employee', 500);
        }
    }

    // DELETE /api/employees/{id}
    public function delete($id) {
        if ($this->employeeModel->delete($id)) {
            Response::success([], 'Employee deleted successfully');
        } else {
            Response::error('Failed to delete employee', 500);
        }
    }
}
