/*
function addEmployee() {
document.getElementById('addEmployeeModal').classList.add('active');
}

function closeModal() {
document.getElementById('addEmployeeModal').classList.remove('active');
document.getElementById('addEmployeeForm').reset();
}

// Close modal when clicking outside
document.getElementById('addEmployeeModal').addEventListener('click', function(e) {
if (e.target === this) {
    closeModal();
}
});

// Handle form submission - Connect to backend
document.getElementById('addEmployeeForm').addEventListener('submit', async function(e) {
e.preventDefault();

let token = localStorage.getItem("token");

// Check if token exists, if not prompt user to login
if (!token) {
    alert("You need to be logged in to add an employee. Please login first.");
    // Redirect to login page or show login form
    window.location.href = "/earist-leave-system/frontend/";
    return;
}

const formData = new FormData(this);
const employeeData = Object.fromEntries(formData);

console.log("Sending Employee Data:", employeeData);

try {
    const res = await fetch("/earist-leave-system/backend/index.php?route=employees&action=create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify(employeeData)
    });

    const result = await res.json();

    if (result.success) {
        alert("Employee added successfully!");
        closeModal();
        // Reload the page to see the new employee
        location.reload();
    } else {
        console.error(result);

        // Handle token expiration
        if (result.message && result.message.includes("Invalid or expired token")) {
            alert("Your session has expired. Please login again.");
            localStorage.removeItem("token");
            window.location.href = "/earist-leave-system/frontend/";
        } else {
            alert("Failed: " + (result.message || JSON.stringify(result.errors)));
        }
    }

} catch (error) {
    console.error("Network error:", error);
    alert("Could not connect to server: " + error.message);
}
});

function searchEmployees() {
const name = document.getElementById('filterName').value;
const position = document.getElementById('filterPosition').value;
const entrance = document.getElementById('filterEntrance').value;

alert(`Searching for:\nName: ${name}\nPosition: ${position}\nEntrance: ${entrance}`);
// Implement your search functionality here
}

function clearFilters() {
document.getElementById('filterName').value = '';
document.getElementById('filterPosition').value = '';
document.getElementById('filterEntrance').value = '';
// Reload all employees
}

function viewLeaveReports(id) {
alert(`Viewing leave reports for employee ID: ${id}`);
// Implement view leave reports functionality
}

function updateEmployee(id) {
alert(`Update employee ID: ${id}`);
// Implement update employee functionality
}

function deleteEmployee(id) {
if (confirm('Are you sure you want to delete this employee?')) {
    alert(`Delete employee ID: ${id}`);
    // Implement delete employee functionality
}
}


// Fetch all employees from backend
async function loadEmployees() {
    const token = localStorage.getItem("token");

    if (!token) {
        console.error("No token. Please login.");
        return;
    }

    try {
        const response = await fetch("/earist-leave-system/backend/index.php?route=employees", {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        const result = await response.json();
        console.log("Backend response:", result);

        if (result.success && result.data.employees) {
            displayEmployees(result.data.employees);
        }
    } catch (error) {
        console.error("Fetch error:", error);
    }
}

// Display employees in table
function displayEmployees(employees) {
    const tableBody = document.getElementById('employeeTableBody');
    tableBody.innerHTML = ''; // Clear old rows

    employees.forEach(emp => {

        if(emp.length === 0) {
            const row = `<tr><td colspan="9">No employees found.</td></tr>`;
            return;
        }

        const row = `
            <tr>
                <td>${emp.first_name} ${emp.middle_name || ''} ${emp.last_name}</td>
                <td>${emp.position}</td>
                <td><span class="status-badge">${emp.employee_status}</span></td>
                <td>${emp.civil_status}</td>
                <td>${emp.entrance_duty}</td>
                <td>${emp.gsis_policy_number || '-'}</td>
                <td>${emp.tin_number || '-'}</td>
                <td>${emp.national_reference_card_no || '-'}</td>
                <td>
                    <button onclick="viewLeaveReports(${emp.id})">View</button>
                    <button onclick="updateEmployee(${emp.id})">Edit</button>
                    <button onclick="deleteEmployee(${emp.id})">Delete</button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

// Call on page load
document.addEventListener('DOMContentLoaded', loadEmployees);
