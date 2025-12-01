<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/php-error.log');

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../vendor/autoload.php';
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Cell\Coordinate;

function detectColumnHeaders($worksheet) {
    $headerMap = [];
    $expectedHeaders = [
        'position' => ['DESIGNATION'],
        'rate_day' => ['RATE/DAY'],
        'department' => ['OFFICE/DEPARTMENT'],
        'days' => ['DAYS'],
        'no_days' => ['No. of DAYS'],
        'official_time' => ['OFFICIAL TIME'],
        'period' => ['PERIOD'],
        'total_days' => ['Total DAYS'],
        'no_hours' => ['No. of HOURS'],
        'gross_amount' => ['GROSS AMOUNT'],
        'deduction' => ['DEDUCTION Hrs & Mins Amount'],
        'pagibig_cont' => ['PAG-IBIG'],
        'sss_cont' => ['SSS'],
        'net_amount' => ['NET AMT.'],
    ];

    $highestColumn = $worksheet->getHighestColumn();
    $highestColumnIndex = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::columnIndexFromString($highestColumn);

    for ($col = 1; $col <= $highestColumnIndex; $col++) {
        $colLetter = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($col);

        $combinedHeader = '';
        for ($row = 11; $row <= 12; $row++) {
            $cell = $worksheet->getCell($colLetter . $row);
            $cellValue = strtoupper(trim((string) $cell->getCalculatedValue()));
            if (!empty($cellValue)) {
                $combinedHeader .= ($combinedHeader ? ' ' : '') . $cellValue;
            }
        }

        $combinedHeader = trim($combinedHeader);

        foreach ($expectedHeaders as $key => $options) {
            foreach ($options as $header) {
                if ($combinedHeader === strtoupper($header)) {
                    $headerMap[$key] = $colLetter;
                    break 2;
                }
            }
        }
    }

    return $headerMap;
}


function searchEmployee($department, $months, $employeeName) {
    error_log("Starting searchEmployee function");
    error_log("Department: " . $department);
    error_log("Months: " . print_r($months, true));
    error_log("Employee Name: " . $employeeName);

    $results = [];

    foreach ($months as $month) {
        error_log("Processing month: " . $month);
        $filePath = "../excels2/{$department}.xlsx";
        error_log("Looking for file: " . $filePath);
        if (!file_exists($filePath)) {
            error_log("File not found: " . $filePath);
            $results[] = ['month' => $month, 'success' => false, 'error' => 'Department file not found.'];
            continue;
        }

        $reader = IOFactory::createReader('Xlsx');
        $reader->setReadDataOnly(true);

        // First load without sheet restriction to check available sheets
        $spreadsheet = $reader->load($filePath);
        $sheetNames = $spreadsheet->getSheetNames();
        error_log("Available sheets in file: " . print_r($sheetNames, true));

        // Try to find a matching sheet name (case-insensitive)
        $foundSheet = null;
        foreach ($sheetNames as $sheetName) {
            if (strcasecmp($sheetName, $month) === 0) {
                $foundSheet = $sheetName;
                break;
            }
        }

        if (!$foundSheet) {
            error_log("Sheet '{$month}' not found. Available sheets: " . implode(", ", $sheetNames));
            $results[] = [
                'month' => $month,
                'success' => false,
                'error' => "Sheet '{$month}' not found in the Excel file."
            ];

            $spreadsheet->disconnectWorksheets();
            unset($spreadsheet);
            continue;
        }

        $worksheet = $spreadsheet->getSheetByName($foundSheet);

         // ✅ Log memory after loading
        $usedMemoryMB = round(memory_get_usage(true) / 1024 / 1024, 2);
        error_log("🔄 Memory used after loading '{$month}' sheet: {$usedMemoryMB} MB");

        if (!$worksheet) {
            $results[] = ['month' => $month, 'success' => false, 'error' => 'Month sheet not found.'];

            // 🧼 CLEANUP
            $spreadsheet->disconnectWorksheets();
            unset($spreadsheet);
            gc_collect_cycles();

             // ✅ Log memory after loading
            $usedMemoryMB = round(memory_get_usage(true) / 1024 / 1024, 2);
            error_log("🔄 Memory used after loading '{$month}' sheet: {$usedMemoryMB} MB");

            continue;
        }

        $headerMap = detectColumnHeaders($worksheet);
        $headerMap['name'] = 'B';

        $highestRow = $worksheet->getHighestRow();
        $found = false;

        for ($row = 9; $row <= $highestRow; $row++) {
            $name = trim((string) $worksheet->getCell($headerMap['name'] . $row)->getCalculatedValue());
            if (!empty($name) && stripos($name, $employeeName) !== false) {
                $employeeData = [
                    'name' => $name,
                    'department' => $department,
                    'month' => $month,
                    'first_quencena' => '0',
                    'second_quencena' => '0'
                ];

                foreach ($headerMap as $key => $col) {
                    if ($key === 'name') continue;
                    $cellValue = $worksheet->getCell($col . $row)->getCalculatedValue();
                    $employeeData[$key] = is_numeric($cellValue) ? floatval($cellValue) : ($cellValue ?: '0');
                }

                // Handle first and second quincena based on the month period
                if (strpos($month, '1-15') !== false) {
                    $employeeData['first_quencena'] = $employeeData['net_amount'];
                } else if (strpos($month, '16-') !== false) {
                    $employeeData['second_quencena'] = $employeeData['net_amount'];
                }

                $results[] = ['month' => $month, 'success' => true, 'employee' => $employeeData];
                $found = true;
                break;
            }
        }

        if (!$found) {
            error_log("Employee '$employeeName' not found in department '$department', month '$month'");
            $results[] = [
                'month' => $month,
                'success' => false,
                'error' => 'Employee not found in this month.'
            ];
        }

        // 🧼 CLEANUP – placed at the end of each iteration
        $spreadsheet->disconnectWorksheets();
        unset($spreadsheet);
        gc_collect_cycles();

         // ✅ Log memory after loading
        $usedMemoryMB = round(memory_get_usage(true) / 1024 / 1024, 2);
        error_log("🔄 Memory used after loading '{$month}' sheet: {$usedMemoryMB} MB");
    }


    return $results;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    error_log("POST request received");
    $department = $_POST['department'] ?? '';
    $monthStr = $_POST['month'] ?? '';
    $employee = $_POST['employee'] ?? '';

    error_log("Department: " . $department);
    error_log("Months: " . $monthStr);
    error_log("Employee: " . $employee);

    if (!$department || !$monthStr || !$employee) {
        error_log("Missing fields: department={$department}, months={$monthStr}, employee={$employee}");
        echo json_encode(['success' => false, 'error' => 'Missing required fields']);
        exit;
    }

    $months = array_filter(explode(",", $monthStr)); // Remove empty values
    error_log("Parsed months array: " . print_r($months, true));

    if (empty($months)) {
        error_log("No months selected");
        echo json_encode(['success' => false, 'error' => 'Please select at least one month']);
        exit;
    }

    $data = searchEmployee($department, $months, $employee);

    echo json_encode([
        'success' => true,
        'results' => $data
    ]);
    exit;
}
