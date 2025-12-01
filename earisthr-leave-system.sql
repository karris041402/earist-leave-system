-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 01, 2025 at 06:01 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `earisthr-leave-system`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `username`, `email`, `password`, `created_at`) VALUES
(1, 'admin', 'admin@earist.edu.ph', '$2y$10$vsjf4O1DGiYwB0ypjLPYeuc8SUDt5DDVWNLWZv54dq7j1pwukBTTq', '2025-11-29 02:48:26');

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `id` int(11) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `middle_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) NOT NULL,
  `birthday` date NOT NULL,
  `gender` varchar(10) NOT NULL,
  `civil_status` varchar(15) NOT NULL,
  `email_address` varchar(255) NOT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `address` text NOT NULL,
  `position` varchar(100) NOT NULL,
  `department` varchar(100) NOT NULL,
  `employee_status` varchar(20) NOT NULL,
  `entrance_duty` datetime NOT NULL,
  `gsis_policy_number` varchar(50) DEFAULT NULL,
  `tin_number` varchar(15) DEFAULT NULL,
  `national_reference_card_no` varchar(50) DEFAULT NULL,
  `sss_number` varchar(12) DEFAULT NULL,
  `philhealth_number` varchar(14) DEFAULT NULL,
  `pagibig_number` varchar(14) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`id`, `first_name`, `middle_name`, `last_name`, `birthday`, `gender`, `civil_status`, `email_address`, `phone_number`, `address`, `position`, `department`, `employee_status`, `entrance_duty`, `gsis_policy_number`, `tin_number`, `national_reference_card_no`, `sss_number`, `philhealth_number`, `pagibig_number`, `created_at`, `updated_at`) VALUES
(1, 'Karris', 'Midtimbang', 'Angkua', '2025-11-06', 'Male', 'Married', 'angkua.h.bscs@gmail.com', '09541477179', '818-A Gunao St. Quiapo, Manila', 'Student Assistant', 'IT', 'Temporary', '2025-11-06 00:00:00', '', '', '', '', '', '', '2025-11-29 02:50:55', '2025-11-29 02:50:55'),
(2, 'Abigail', 'J.', 'Purificacion', '2025-12-13', 'Female', 'Single', 'purificacion@gmail.com', '0546574656545', 'Quiapo, Manila', 'ADMINISTRATIVE ASSISTANT II', 'Admin', 'Permanent', '2024-09-02 00:00:00', '', '', '', '', '', '', '2025-12-01 03:22:46', '2025-12-01 03:22:46');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email_address` (`email_address`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `employees`
--
ALTER TABLE `employees`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
