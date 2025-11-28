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

        // Handle form submission
        document.getElementById('addEmployeeForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const employeeData = Object.fromEntries(formData);
            
            console.log('New Employee Data:', employeeData);
            alert('Employee added successfully!');
            
            // Here you would send the data to your backend
            // fetch('/api/employees', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(employeeData)
            // });
            
            closeModal();
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
        }function addEmployee() {
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

        // Handle form submission
        document.getElementById('addEmployeeForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const employeeData = Object.fromEntries(formData);
            
            console.log('New Employee Data:', employeeData);
            alert('Employee added successfully!');
            
            // Here you would send the data to your backend
            // fetch('/api/employees', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(employeeData)
            // });
            
            closeModal();
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
        }function addEmployee() {
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

       document.getElementById('addEmployeeForm').addEventListener('submit', async function(e) {
            e.preventDefault();

            const token = localStorage.getItem("token"); // 🔥 MAKE SURE token exists

            const formData = new FormData(this);
            const employeeData = Object.fromEntries(formData);

            console.log("Sending Employee Data:", employeeData);

            try {
                const res = await fetch("http://localhost:8081/api/employees", {
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
                } else {
                    console.error(result);
                    alert("Failed: " + result.message);
                }

            } catch (error) {
                console.error("Network error:", error);
                alert("Could not connect to server.");
            }
            
            closeModal();
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