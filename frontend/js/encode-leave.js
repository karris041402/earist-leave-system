
let authToken = null;
let currentUser = null;
let allUsers = [];
let leaveTypes = [];
let leaveRecords = {};

// Utility Functions
async function apiFetch(url, options = {}) {
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
    }

    const response = await fetch(url, {
        ...options,
        headers,
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || data.message || 'API request failed');
    }

    return data;
}

function getDaysInMonth(monthYear) {
    const [year, month] = monthYear.split('-').map(Number);
    return new Date(year, month, 0).getDate();
}

function generateTableHeaderHTML() {
    return `
        <thead>
            <tr>
                <th rowspan="3" class="bg-gray-200">PERIOD</th>
                <th rowspan="3" class="bg-gray-200">PARTICULARS</th>
                <th colspan="31" rowspan="3" class="bg-gray-200"></th>
                <th colspan="10" class="vl-header">VACATION LEAVE</th>
                <th colspan="5" class="sl-header">SICK LEAVE</th>
                <th rowspan="3" class="bg-gray-200">REMARKS</th>
            </tr>
            <tr>
                <th rowspan="2" class="vl-header">TOTAL BALANCE VL</th>
                <th rowspan="2" class="vl-header">EARNED</th>
                <th colspan="2" class="vl-header">Absence Undertime W/Pay</th>
                <th colspan="3" class="vl-header">EQUIVALENT</th>
                <th rowspan="2" class="vl-header">ABSENCE Undertime W/Pay</th>
                <th rowspan="2" class="vl-header">BALANCE</th>
                <th rowspan="2" class="vl-header">ABSENCE Undertime W/o Pay</th>
                <th rowspan="2" class="sl-header">TOTAL BALANCE SL</th>
                <th rowspan="2" class="sl-header">EARNED</th>
                <th rowspan="2" class="sl-header">ABSENCE Undertime W/Pay</th>
                <th rowspan="2" class="sl-header">BALANCE</th>
                <th rowspan="2" class="sl-header">ABSENCE Undertime W/o Pay</th>
            </tr>
            <tr>
                <th class="vl-header text-xs">H</th>
                <th class="vl-header text-xs">M</th>
                <th class="vl-header text-xs">Hr</th>
                <th class="vl-header text-xs">Min</th>
                <th class="vl-header text-xs">Total</th>
            </tr>
        </thead>
    `;
}

function generateTableBodyRowHTML(monthYear, records = {}, summary = {}) {
    const daysInMonth = getDaysInMonth(monthYear);
    const [year, month] = monthYear.split('-').map(Number);
    const monthName = new Date(year, month - 1).toLocaleString('default', { month: 'long', year: 'numeric' });

    const firstDay = new Date(year, month - 1, 1).getDay();
    const daysOfWeek = [];
    const dayNames = ['SU', 'M', 'T', 'W', 'TH', 'F', 'SA'];
    for (let i = 0; i < 31; i++) {
        const dayIndex = (firstDay + i) % 7;
        daysOfWeek.push(dayNames[dayIndex]);
    }

    const leaveTypeOptions = leaveTypes.map(type =>
        `<option value="${type.id}" data-code="${type.code}" data-points="${type.point_value}">${type.code}</option>`
    ).join('');

    const dayCells = Array.from({ length: 31 }, (_, i) => {
        const day = i + 1;
        const isDayInMonth = day <= daysInMonth;
        const selectedLeaveTypeId = records[day] || '';

        let content = '';
        let classes = 'day-cell';

        if (isDayInMonth) {
            content = `<select class="day-dropdown" data-day="${day}" data-month-year="${monthYear}">
                <option value="">-</option>
                ${leaveTypeOptions}
            </select>`;
        } else {
            classes += ' bg-gray-100';
        }

        return `<td class="${classes}" data-day="${day}" data-month-year="${monthYear}">${content}</td>`;
    }).join('');

    const periodStart = `${String(month).padStart(2, '0')}/01-${String(daysInMonth).padStart(2, '0')}/${year}`;
    const particularDate = `${month}/${daysInMonth}/${year}`;

    return `
        <tbody data-month-year="${monthYear}">
            <tr>
                <th></th>
                <th></th>
                <th colspan="31" class="font-bold">${monthName}</th>
                ${Array.from({ length: 10 }, () => '<th class="vl-header"></th>').join('')}
                ${Array.from({ length: 5 }, () => '<th class="sl-header"></th>').join('')}
                <th></th>
            </tr>
            <tr>
                <th></th>
                <th></th>
                ${daysOfWeek.map(day => `<th class="text-xs">${day}</th>`).join('')}
                ${Array.from({ length: 10 }, () => '<th class="vl-header"></th>').join('')}
                ${Array.from({ length: 5 }, () => '<th class="sl-header"></th>').join('')}
                <th></th>
            </tr>
            <tr>
                <th></th>
                <th></th>
                ${Array.from({ length: daysInMonth }, (_, i) => `<th class="text-xs">${i + 1}</th>`).join('')}
                ${Array.from({ length: 31 - daysInMonth }, () => `<th></th>`).join('')}
                ${Array.from({ length: 10 }, () => '<th class="vl-header"></th>').join('')}
                ${Array.from({ length: 5 }, () => '<th class="sl-header"></th>').join('')}
                <th></th>
            </tr>
            <tr>
                <td>${periodStart}</td>
                <td></td>
                ${dayCells}
                <td class="vl-total">0.000</td>
                <td class="vl-header"></td>
                <td class="vl-abs-w-pay-m">
                    <input type="number" class="vl-auto-input input-vl-hours" min="0" value="" />
                </td>
                <td class="vl-abs-w-pay-hr">
                    <input type="number" class="vl-auto-input input-vl-minutes" min="0" value="" />
                </td>
                <td class="vl-equiv-hr">0.000</td>
                <td class="vl-equiv-min">0.000</td>
                <td class="vl-equiv-total">0.000</td>
                <td class="vl-abs-w-pay-total">0.000</td>
                <td class="vl-header"></td>
                <td class="vl-abs-wo-pay">0.000</td>
                <td class="sl-total">0.000</td>
                <td class="sl-earned">0.000</td>
                <td class="sl-abs-w-pay">0.000</td>
                <td class="sl-balance"></td>
                <td class="sl-abs-wo-pay">0.000</td>
                <td></td>
            </tr>
            <tr>
                <td></td>
                <td class="bg-yellow-200">${particularDate}</td>
                ${Array.from({ length: 31 }, () => `<td></td>`).join('')}
                <td class="vl-header"></td>
                <td class="vl-earned">1.25</td>
                ${Array.from({ length: 6 }, () => '<th class="vl-header"></th>').join('')}
                <td class="vl-earned">1.25</td>
                <td class="vl-header"></td>
                <td class="sl-header"></td>
                <td class="sl-earned">1.25</td>
                <td class="sl-header"></td>
                <td class="sl-earned">1.25</td>
                <td class="sl-header"></td>
                <td></td>
            </tr>
        </tbody>
    `;
}

function renderLeaveTable() {
    const container = document.getElementById('leave-table-wrapper');
    if (!container) return;

    let tableHTML = `<table class="leave-table">
        ${generateTableHeaderHTML()}
    `;
    const sortedMonths = Object.keys(leaveRecords).sort();
    for (const monthYear of sortedMonths) {
        const records = leaveRecords[monthYear].records;
        const summary = leaveRecords[monthYear].summary;
        tableHTML += generateTableBodyRowHTML(monthYear, records, summary);
    }

    tableHTML += `</table>`;
    container.innerHTML = tableHTML;

    document.querySelectorAll('.day-dropdown').forEach(dropdown => {
        dropdown.addEventListener('change', handleLeaveChange);

        const monthYear = dropdown.dataset.monthYear;
        const day = dropdown.dataset.day;
        const record = leaveRecords[monthYear]?.records;

        if (record && record[day]) {
            dropdown.value = record[day];
        }
    });

    document.querySelectorAll(".input-vl-hours, .input-vl-minutes").forEach(input => {
        input.addEventListener("input", (e) => {
            const row = e.target.closest("tr");
            computeVLEquivalent(row);
        });
    });

    calculateAllTotals();
}

function displayEmployeeInfo(employee) {
    document.getElementById('emp-name').textContent = employee.name || '-';
    document.getElementById('emp-position').textContent = employee.position || '-';
    document.getElementById('emp-status').textContent = employee.status || '-';
    document.getElementById('emp-civil-status').textContent = employee.civil_status || '-';
    document.getElementById('emp-entry-date').textContent = employee.entry_date || '-';
    document.getElementById('emp-gsis').textContent = employee.gsis_no || '-';
    document.getElementById('emp-tin').textContent = employee.tin_no || '-';
    document.getElementById('emp-nrc').textContent = employee.nrc_no || '-';

    // Show the table container
    document.getElementById('leave-table-container').style.display = 'block';
}

function handleLeaveChange(event) {
    const dropdown = event.target;
    const monthYear = dropdown.dataset.monthYear;
    const day = dropdown.dataset.day;
    const leaveTypeId = dropdown.value;

    if (!leaveRecords[monthYear]) {
        leaveRecords[monthYear] = { records: {}, summary: {} };
    }

    if (leaveTypeId) {
        leaveRecords[monthYear].records[day] = parseInt(leaveTypeId);
    } else {
        delete leaveRecords[monthYear].records[day];
    }

    calculateAllTotals();
}

function calculateAllTotals() {
    const leaveTypeMap = leaveTypes.reduce((acc, type) => {
        acc[type.id] = type;
        return acc;
    }, {});

    for (const monthYear in leaveRecords) {
        const records = leaveRecords[monthYear].records;
        let totalVLPts = 0;
        let totalSLPts = 0;

        for (const day in records) {
            const leaveTypeId = records[day];
            const type = leaveTypeMap[leaveTypeId];

            if (type) {
                const points = parseFloat(type.point_value);
                if (type.code.startsWith('VL') || type.code.startsWith('VHD')) {
                    totalVLPts += points;
                } else if (type.code.startsWith('SL')) {
                    totalSLPts += points;
                }
            }
        }

        const tbody = document.querySelector(`tbody[data-month-year="${monthYear}"]`);
        if (tbody) {
            tbody.querySelector('.vl-total').textContent = totalVLPts.toFixed(3);
            tbody.querySelector('.sl-total').textContent = totalSLPts.toFixed(3);
        }
    }
}

function computeVLEquivalent(row) {
    const hours = parseFloat(row.querySelector(".input-vl-hours")?.value || 0);
    const minutes = parseFloat(row.querySelector(".input-vl-minutes")?.value || 0);

    const hourDay = hours * 0.125;
    const minuteDay = minutes * (0.125 / 60);

    row.querySelector(".vl-equiv-hr").textContent = hourDay.toFixed(3);
    row.querySelector(".vl-equiv-min").textContent = minuteDay.toFixed(3);
    row.querySelector(".vl-equiv-total").textContent = (hourDay + minuteDay).toFixed(3);
    row.querySelector(".vl-abs-w-pay-total").textContent = (hourDay + minuteDay).toFixed(3);
}

// Demo initialization - replace with actual API calls
function initDemo() {
    // Sample leave types
    leaveTypes = [
        { id: 1, code: 'VL', point_value: '1.000' },
        { id: 2, code: 'SL', point_value: '1.000' },
        { id: 3, code: 'VL8', point_value: '1.000' },
        { id: 4, code: 'SL8', point_value: '1.000' },
        { id: 5, code: 'SPL', point_value: '0.000' },
    ];

    // Sample employees with full info
    const employees = [
        {
            id: 1,
            name: 'Juan Dela Cruz',
            position: 'Administrative Officer IV',
            status: 'Permanent',
            civil_status: 'Married',
            entry_date: '01/15/2018',
            gsis_no: '1234567890',
            tin_no: '123-456-789-000',
            nrc_no: 'NRC-2024-001'
        },
        {
            id: 2,
            name: 'Maria Santos',
            position: 'Faculty Member III',
            status: 'Permanent',
            civil_status: 'Single',
            entry_date: '06/01/2019',
            gsis_no: '0987654321',
            tin_no: '987-654-321-000',
            nrc_no: 'NRC-2024-002'
        },
        {
            id: 3,
            name: 'Pedro Garcia',
            position: 'Department Head',
            status: 'Permanent',
            civil_status: 'Married',
            entry_date: '03/10/2015',
            gsis_no: '5647382910',
            tin_no: '564-738-291-000',
            nrc_no: 'NRC-2024-003'
        }
    ];

    const select = document.getElementById('employee-select');
    select.innerHTML = '<option value="">Select Employee</option>';
    employees.forEach((emp) => {
        const option = document.createElement('option');
        option.value = emp.id;
        option.textContent = emp.name;
        option.dataset.employee = JSON.stringify(emp);
        select.appendChild(option);
    });

    // Event listeners
    document.getElementById('btn-render-month').addEventListener('click', () => {
        const employeeSelect = document.getElementById('employee-select');
        const monthYear = document.getElementById('month-select').value;

        if (!employeeSelect.value) {
            alert('Please select an employee first');
            return;
        }

        if (!monthYear) {
            alert('Please select a month');
            return;
        }

        // Get selected employee info
        const selectedOption = employeeSelect.options[employeeSelect.selectedIndex];
        const employee = JSON.parse(selectedOption.dataset.employee);

        // Display employee info
        displayEmployeeInfo(employee);

        // Render table
        leaveRecords = {};
        leaveRecords[monthYear] = { records: {}, summary: {} };
        renderLeaveTable();
    });

    document.getElementById('btn-append-month').addEventListener('click', () => {
        const employeeSelect = document.getElementById('employee-select');
        const monthYear = document.getElementById('month-select').value;

        if (!employeeSelect.value) {
            alert('Please select an employee first');
            return;
        }

        if (!monthYear) {
            alert('Please select a month');
            return;
        }

        if (leaveRecords[monthYear]) {
            alert('Month already exists');
            return;
        }

        leaveRecords[monthYear] = { records: {}, summary: {} };
        renderLeaveTable();
    });

    document.getElementById('btn-save-all').addEventListener('click', () => {
        if (Object.keys(leaveRecords).length === 0) {
            alert('No data to save. Please render a month first.');
            return;
        }
        alert('Preparing data for save...');
        console.log('Leave Records:', leaveRecords);
    });

    // Save Leave Records button
    document.getElementById('btn-save-leave-records').addEventListener('click', () => {
        const employeeSelect = document.getElementById('employee-select');

        if (!employeeSelect.value) {
            alert('No employee selected');
            return;
        }

        if (Object.keys(leaveRecords).length === 0) {
            alert('No leave records to save');
            return;
        }

        // Prepare data for API
        const saveData = {
            employee_id: employeeSelect.value,
            employee_name: employeeSelect.options[employeeSelect.selectedIndex].text,
            leave_records: leaveRecords
        };

        console.log('Saving to database:', saveData);
        alert('Leave records saved successfully!\n\nCheck console for data structure.');

        // TODO: Replace with actual API call
        // await apiFetch(`${API_BASE_URL}/leaves/save`, {
        //     method: 'POST',
        //     body: JSON.stringify(saveData)
        // });
    });
}

document.addEventListener('DOMContentLoaded', initDemo);
