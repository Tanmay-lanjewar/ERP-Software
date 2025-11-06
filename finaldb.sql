-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 01, 2025 at 04:29 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `erp_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `counters`
--

CREATE TABLE `counters` (
  `id` varchar(50) NOT NULL,
  `seq` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `counters`
--

INSERT INTO `counters` (`id`, `seq`) VALUES
('invoice_2023-24', 3),
('invoice_2025-26', 35),
('purchaseorder_2023-24', 52),
('purchaseorder_2025-26', 19),
('quotation_2023-24', 2),
('quotation_2025-26', 4);

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `id` int(11) NOT NULL,
  `customer_type` enum('Domestic','International') NOT NULL DEFAULT 'Domestic',
  `title` enum('MR','MS','MRS','DR') DEFAULT 'MR',
  `customer_name` varchar(100) NOT NULL,
  `company_name` varchar(100) DEFAULT NULL,
  `display_name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `mobile` varchar(15) DEFAULT NULL,
  `office_no` varchar(15) DEFAULT NULL,
  `pan` varchar(20) DEFAULT NULL,
  `gst` varchar(30) DEFAULT NULL,
  `currency` varchar(10) DEFAULT 'INR',
  `document_path` varchar(255) DEFAULT NULL,
  `billing_recipient_name` varchar(100) DEFAULT NULL,
  `billing_country` varchar(50) DEFAULT NULL,
  `billing_address1` text DEFAULT NULL,
  `billing_address2` text DEFAULT NULL,
  `billing_city` varchar(50) DEFAULT NULL,
  `billing_state` varchar(50) DEFAULT NULL,
  `billing_state_code` varchar(10) DEFAULT NULL COMMENT 'State code for billing address (e.g., 27 for Maharashtra)',
  `billing_pincode` varchar(10) DEFAULT NULL,
  `billing_fax` varchar(20) DEFAULT NULL,
  `billing_phone` varchar(20) DEFAULT NULL,
  `shipping_recipient_name` varchar(100) DEFAULT NULL,
  `shipping_country` varchar(50) DEFAULT NULL,
  `shipping_address1` text DEFAULT NULL,
  `shipping_address2` text DEFAULT NULL,
  `shipping_city` varchar(50) DEFAULT NULL,
  `shipping_state` varchar(50) DEFAULT NULL,
  `shipping_state_code` varchar(10) DEFAULT NULL COMMENT 'State code for shipping address (e.g., 27 for Maharashtra)',
  `shipping_pincode` varchar(10) DEFAULT NULL,
  `shipping_fax` varchar(20) DEFAULT NULL,
  `shipping_phone` varchar(20) DEFAULT NULL,
  `remark` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('Active','Inactive') DEFAULT 'Active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`id`, `customer_type`, `title`, `customer_name`, `company_name`, `display_name`, `email`, `mobile`, `office_no`, `pan`, `gst`, `currency`, `document_path`, `billing_recipient_name`, `billing_country`, `billing_address1`, `billing_address2`, `billing_city`, `billing_state`, `billing_state_code`, `billing_pincode`, `billing_fax`, `billing_phone`, `shipping_recipient_name`, `shipping_country`, `shipping_address1`, `shipping_address2`, `shipping_city`, `shipping_state`, `shipping_state_code`, `shipping_pincode`, `shipping_fax`, `shipping_phone`, `remark`, `created_at`, `status`) VALUES
(1, 'Domestic', 'MR', 'Jonhey ', 'Doe Industries', 'John D.', 'john.doe@example.com', '9876543210', '02212345678', 'ABCDE1234F', '27ABCDE1234F1Z5', 'INR', '/path/to/document.pdf', 'Jane Doe', 'India', '123 Billing Street', 'Suite 456', 'Mumbai', 'Maharashtra', NULL, '400001', '02298765432', '02212349876', 'Jake Doe', 'India', '789 Shipping Lane', 'Floor 2', 'Pune', 'Maharashtra', NULL, '411001', '02076543210', '02012345670', 'Test remark entry', '2025-07-16 16:19:39', 'Active'),
(2, 'International', 'MS', 'Alice Smith', 'Smith Global Ltd', 'A. Smith', 'alice.smith@example.com', '1234567890', '01123456789', 'ABCDE5678G', '29ABCDE5678G1Z9', 'USD', '/docs/alice_contract.pdf', 'Bob Smith', 'USA', '456 Elm Street', 'Apt 12', 'New York', 'NY', NULL, '10001', '001123456789', '001987654321', 'Carol Smith', 'USA', '789 Oak Avenue', 'Suite 300', 'Los Angeles', 'CA', NULL, '90001', '001654321098', '001321654987', 'First international customer', '2025-07-16 16:25:00', 'Active'),
(3, 'Domestic', 'DR', 'Dr. Rahul Mehra', 'Mehra Health Pvt Ltd', 'Dr. Mehra', 'rahul.mehra@health.com', '9988776655', '08022334455', 'AABCD2345H', '33AABCD2345H1Z2', 'INR', '/docs/rahul_profile.pdf', 'Sonal Mehra', 'India', '789 Health Road', 'Block B', 'Bangalore', 'Karnataka', NULL, '560001', '08033445566', '08044556677', 'Ravi Mehra', 'India', '123 Care Avenue', 'Wing C', 'Hyderabad', 'Telangana', NULL, '500001', '04055667788', '04066778899', 'Priority healthcare customer', '2025-07-16 16:25:39', 'Active'),
(4, 'International', 'MRS', 'Emily Johnson', 'Johnson Exports', 'E. Johnson', 'emily.johnson@exports.com', '8765432109', '02033445566', 'AACDE6789J', '07AACDE6789J1Z7', 'EUR', '/docs/emily_invoice.pdf', 'Michael Johnson', 'Germany', '321 Export Boulevard', 'Building 9', 'Berlin', 'Berlin', NULL, '10115', '0049123456789', '0049987654321', 'Sara Johnson', 'Germany', '654 Import Street', 'Unit 5', 'Hamburg', 'Hamburg', NULL, '20095', '0049765432109', '0049876543210', 'Important EU customer', '2025-07-16 16:26:04', 'Active'),
(5, 'Domestic', 'MR', 'anshu ', 'pie', 'dfgdf', 'dfg', 'fgd', 'fdgd', 'fgdf', 'fdfg', 'INR', 'fgdgdf', 'dfgdfgf', 'dfgfgfggfgfgfgffgdfgfd', '', 'gdfdfgdfgdfgfgfgdf', 'fgdfgdfdfgfgdfdf', 'fgfdgdfgfdgfdgfgfdg', NULL, 'fgdfgdfdfg', 'fgdfgdfgdfgfgf', 'fgdfgffgdfgfddfg', 'dfgfgfggffgdfgdf', 'India', 'fgdfgffgdfgdf', 'LIC OFFICE ROAD', 'Wardha', 'Maharashtra', NULL, '442001', '', '07588674622', '', '2025-07-23 16:12:52', 'Active'),
(6, 'Domestic', 'MR', 'Anush Raju Pise', '', 'dfgdf', 'anshupise95@gmail.com', '07588674622', '', 'fgdf', '', 'INR', '', '', 'India', 'KOCHER WARD HINGANGHAT', 'LIC OFFICE ROAD', 'Wardha', 'Maharashtra', NULL, '442001', '', '', 'dfgfgfggffgdfgdf', 'India', 'KOCHER WARD HINGANGHAT', 'LIC OFFICE ROAD', 'Wardha', 'Maharashtra', NULL, '442001', '', '07588674622', '', '2025-07-26 16:26:27', 'Active'),
(7, 'Domestic', 'MR', 'ANUSH RAJU PISE', 'BD college wardha', 'watch', 'anshupise95@gmail.com', '07823084754', '', '', 'utiuiutiu98598598', 'INR', '', '959858', 'India', 'kocher coloney hinganghat', 'lic office road', 'SEWAGRAM', 'Maharashtra', NULL, '442301', '', '9876', '35094598', '3', 'kocher coloney hinganghat', 'lic office road', 'SEWAGRAM', 'Maharashtra', NULL, '442301', '', '07823084754', 'jhg', '2025-08-20 09:44:43', 'Active'),
(8, 'Domestic', 'MR', 'rdj', 'stark tower', 'tony', 'tony@gmail.com', '7823084754', '567', 'asdf1234', 'as234df56gh78', 'INR', '', 'tony ', 'india', 'stark tower', 'stark tower 2', 'new york', 'michigan', NULL, '442302', '7687', '7823084754', 'tony stark', 'india', 'stark tower', 'tower 2', 'michigan', 'new york', NULL, '442301', '985', '7823084754', 'nothing', '2025-08-30 16:41:33', 'Active'),
(9, 'Domestic', 'MR', 'akshay wadi', 'cosmos digital', 'lkjhdfgjkdfgjkdf', 'anshupise95@gmail.com', 'klfhkjhdfgj', 'jfhgdjkfg', 'djfhjgdkjfhg', 'dfjgkdjfhg', 'INR', 'dfjghdkjfhgdjk', 'fhgjdkfhgjd', 'India', 'kocher coloney hinganghat', 'lic office road', 'SEWAGRAM', 'Maharashtra', NULL, '442301', 'dfkdfjgh', 'lffkgdkfhgjdfh', 'dlfkldkfgjkd', 'kfjklfgjkdlfhg', 'kjgklfjkdj', 'lfndklfhg', 'fklgjdlfjkgdlkf', 'skdfklsdhfj', NULL, 'lkgkdfhgjd', 'jnjsgjdgjkd', 'sjjdhgdfhgkjd', 'sdhdkjhgj', '2025-09-02 11:38:10', 'Active'),
(10, 'Domestic', 'MR', 'swati mam', 'swati industris', 'swati cosmos', 'anshupise95@gmail.com', '07823084754', '9874598345', '487398457384', '25kfgdkj98237', 'INR', '', 'swati cos', 'India', 'kocher coloney hinganghat', 'lic office road', 'SEWAGRAM', 'Maharashtra', '25', '442301', 'lksf', 'sdfkl', 'swati', 'India', 'KOCHER WARD HINGANGHAT', 'LIC OFFICE ROAD', 'Wardha', 'Maharashtra', '25', '442001', 'lksfhjks', '07588674622', '', '2025-10-17 09:06:49', 'Active'),
(11, 'Domestic', 'MR', 'Test Customer Maharashtra', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'INR', NULL, NULL, NULL, 'Test Address', NULL, 'Mumbai', 'Maharashtra', '27', '400001', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-17 10:16:08', 'Active'),
(12, 'Domestic', 'MR', 'samiksha', 'samiksha industries', 'samiksha ind', 'anshupise95@gmail.com', '07823084754', '9874598345', '487398457384', '25kfgdkj98237', 'INR', 'kejf', 'swati cos', 'India', 'kocher coloney hinganghat', 'lic office road', 'SEWAGRAM', 'Maharashtra', '27', '442301', 'lksf', 'kdjch', 'swati', 'India', 'KOCHER WARD HINGANGHAT', 'LIC OFFICE ROAD', 'Wardha', 'Maharashtra', '27', '442001', 'lksfhjks', '07588674622', 'efkjn', '2025-10-17 10:25:35', 'Active'),
(13, 'Domestic', '', 'samiksha chaudh', 'samiksha industries', 'samiksha ind', 'anshupise95@gmail.com', '07823084754', '9874598345', '487398457384', '25kfgdkj98237', 'INR', 'kejf', 'samiwati cos', 'India', 'kocher coloney hinganghat', 'lic office road', 'SEWAGRAM', 'Maharashtra', '22', '442301', 'lksf', '', 'swati', 'India', 'KOCHER WARD HINGANGHAT', 'LIC OFFICE ROAD', 'Wardha', 'Maharashtra', '22', '442001', 'lksfhjks', '07588674622', 'efkjn', '2025-10-22 10:41:36', 'Active');

-- --------------------------------------------------------

--
-- Table structure for table `financial_years`
--

CREATE TABLE `financial_years` (
  `id` int(11) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `is_active` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `financial_years`
--

INSERT INTO `financial_years` (`id`, `start_date`, `end_date`, `is_active`, `created_at`) VALUES
(1, '2023-03-16', '2024-03-15', 0, '2025-07-16 16:00:29'),
(3, '2024-04-01', '2025-03-31', 0, '2025-07-23 08:46:33'),
(4, '2025-08-07', '2026-08-06', 1, '2025-08-20 09:35:29'),
(5, '2025-04-01', '2025-07-31', 0, '2025-10-09 08:07:15');

-- --------------------------------------------------------

--
-- Table structure for table `invoice`
--

CREATE TABLE `invoice` (
  `invoice_number` varchar(20) DEFAULT NULL,
  `customer_name` varchar(255) NOT NULL,
  `invoice_date` date NOT NULL,
  `expiry_date` date NOT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `customer_notes` text DEFAULT NULL,
  `terms_and_conditions` text DEFAULT NULL,
  `sub_total` double DEFAULT NULL,
  `freight` decimal(10,2) DEFAULT 0.00,
  `cgst` double DEFAULT NULL,
  `sgst` double DEFAULT NULL,
  `igst` decimal(10,2) DEFAULT 0.00,
  `grand_total` double DEFAULT NULL,
  `status` enum('Draft','Partial','Paid') DEFAULT 'Draft',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `customer_id` int(11) NOT NULL,
  `invoice_id` int(11) NOT NULL,
  `financial_year_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `invoice`
--

INSERT INTO `invoice` (`invoice_number`, `customer_name`, `invoice_date`, `expiry_date`, `subject`, `customer_notes`, `terms_and_conditions`, `sub_total`, `freight`, `cgst`, `sgst`, `igst`, `grand_total`, `status`, `created_at`, `customer_id`, `invoice_id`, `financial_year_id`) VALUES
('INV-000000', 'Dr. Rahul Mehra', '2025-08-18', '2025-08-29', 'kj', 'fdkjfkjg', 'lklkl', 63764, 0.00, 5738.76, 5738.76, 0.00, 75241.52, 'Draft', '2025-08-30 14:48:49', 5, 1, 4),
('INV-000000', 'anshu ', '2025-08-18', '2025-08-29', 'night man', 'please note for invoice', 'fill conditions', 661132, 0.00, 59501.88, 59501.88, 0.00, 780135.76, 'Draft', '2025-08-30 14:51:19', 3, 2, 4),
('INV-000000', 'Emily Johnson', '2025-08-18', '2025-08-29', 'jfsh', 'kjsj', 'nintght bird', 36916, 0.00, 3322.44, 3322.44, 0.00, 43560.88, 'Paid', '2025-08-30 16:45:14', 8, 3, 4),
('INV-000004', 'rdj', '0000-00-00', '0000-00-00', 'kjkj', 'jh', '', 81383, 0.00, 7324.47, 7324.47, 0.00, 96031.94, 'Draft', '2025-08-30 16:59:53', 8, 4, 4),
('INV-000005', 'rdj', '2025-08-13', '2025-08-26', 'mn', 'kh', 'jh', 164444, 0.00, 14799.96, 14799.96, 0.00, 194043.92, 'Paid', '2025-08-30 17:05:23', 8, 5, 4),
('INV-000006', 'Anush Raju Pise', '0000-00-00', '0000-00-00', '', 'kj', 'jkj', 46145, 0.00, 4153.05, 4153.05, 0.00, 54451.1, 'Partial', '2025-09-04 11:51:20', 6, 6, 4),
('INV-000007', 'Emily Johnson', '2025-09-10', '2025-09-07', 'hgdjhagd', 'hjgf', 'jgh', 72154, 0.00, 6493.86, 6493.86, 0.00, 85141.72, 'Paid', '2025-09-05 07:53:08', 4, 7, 4),
('ME/2023-24/001', 'Dr. Rahul Mehra', '0000-00-00', '0000-00-00', '', '', '', 0, 0.00, 0, 0, 0.00, 0, 'Draft', '2025-09-12 09:15:45', 3, 8, 4),
('ME/2023-24/002', 'Dr. Rahul Mehra', '2025-09-15', '2025-08-31', 'hgjh', 'vv', 'jhv', 62925, 0.00, 5663.25, 5663.25, 0.00, 74251.5, 'Draft', '2025-09-18 09:10:38', 3, 9, 4),
('ME/2025-26/001', 'Emily Johnson', '2024-03-07', '0000-00-00', 'l', 'jk', 'j', 6240, 0.00, 561.6, 561.6, 0.00, 7363.2, 'Draft', '2025-10-09 09:11:05', 4, 11, NULL),
('ME/2025-26/002', 'Emily Johnson', '2025-10-15', '2025-10-01', 'fgd', 'hrt', '456', 35100, 5656.00, 3668.04, 3668.04, 0.00, 48092.08, 'Paid', '2025-10-14 12:13:15', 4, 12, NULL),
('ME/2025-26/003', 'Dr. Rahul Mehra', '2025-10-10', '2025-10-01', 'k', 'kj', 'jh', 60840, 7.00, 5476.23, 5476.23, 0.00, 71799.46, 'Paid', '2025-10-15 08:07:36', 3, 13, NULL),
('ME/2025-26/004', 'Emily Johnson', '2025-10-20', '2025-10-12', 'id', 'sdj', 'skj', 0, 88.00, 0, 0, 15.84, 103.84, 'Paid', '2025-10-16 08:29:12', 0, 14, NULL),
('ME/2025-26/005', 'Test Customer', '2025-01-17', '2025-01-27', 'Test Invoice', 'Test notes', 'Test terms', 100, 0.00, 0, 0, 18.00, 118, 'Draft', '2025-10-17 09:57:08', 3, 15, NULL),
('ME/2025-26/006', 'swati mam', '2025-09-30', '2025-09-22', 'fs', 'vc', '', 0, 45.00, 0, 0, 8.10, 53.1, 'Paid', '2025-10-17 09:58:53', 0, 16, NULL),
('ME/2025-26/007', 'ANUSH RAJU PISE', '2025-10-29', '2025-10-13', 'ff', '', '', 0, 56.00, 0, 0, 10.08, 66.08, 'Draft', '2025-10-17 10:00:27', 0, 17, NULL),
('ME/2025-26/008', 'Test Customer Maharashtra', '2025-01-17', '2025-02-17', 'Test Invoice - Maharashtra Customer', 'Test notes', 'Test terms', 2000, 100.00, 189, 189, 0.00, 2478, 'Draft', '2025-10-17 10:17:41', 11, 18, NULL),
('ME/2025-26/009', 'swati mam', '2025-01-17', '2025-02-17', 'Test Invoice - Non-Maharashtra Customer', 'Test notes', 'Test terms', 2000, 100.00, 0, 0, 378.00, 2478, 'Draft', '2025-10-17 10:18:08', 10, 19, NULL),
('ME/2025-26/010', 'Dr. Rahul Mehra', '2025-10-14', '2025-10-19', 'lk', '', '', 0, 65.00, 0, 0, 11.70, 76.7, 'Paid', '2025-10-22 11:08:43', 0, 20, NULL),
('ME/2025-26/011', 'samiksha chaudh', '2025-10-10', '2025-10-07', 'nf', 'j', 'hj', 35000, 8.00, 0, 0, 6301.44, 41309.44, 'Paid', '2025-10-30 08:02:19', 13, 21, NULL),
('ME/2025-26/012', 'samiksha chaudh', '2025-10-28', '2025-10-06', 'kdf', 'rt', 'kj', 315000, 48.00, 0, 0, 56708.64, 371756.64, 'Partial', '2025-10-30 10:59:41', 13, 22, NULL),
('ME/2025-26/013', 'Test Customer Maharashtra', '2025-10-23', '2025-10-06', '3r', 'e', 'rg', 31815000, 12.00, 2863351.08, 2863351.08, 0.00, 37541714.16, 'Partial', '2025-10-30 11:01:59', 11, 23, NULL),
('ME/2025-26/014', 'samiksha chaudh', '2025-10-27', '2025-10-12', 'e', 'fg', 'fv', 308000, 81.00, 0, 0, 55454.58, 363535.58, 'Paid', '2025-10-30 11:03:54', 13, 24, NULL),
('ME/2025-26/015', 'samiksha chaudh', '2025-10-28', '2025-10-13', '54', 'ggf', '', 308000, 445.00, 0, 0, 55520.10, 363965.1, 'Paid', '2025-10-30 11:06:45', 13, 25, NULL),
('ME/2025-26/016', 'samiksha chaudh', '2025-10-14', '2025-10-07', '875', 'ej', 'jfh', 25840, 7.00, 0, 0, 4652.46, 30499.46, 'Partial', '2025-10-30 11:28:43', 13, 26, NULL),
('ME/2025-26/017', 'samiksha chaudh', '2025-10-28', '2025-10-12', 'mh', 'hh', '8jjhh', 672000, 987.00, 0, 0, 121137.66, 794124.66, 'Paid', '2025-10-30 11:31:05', 13, 27, NULL),
('ME/2025-26/021', 'samiksha', '2025-10-14', '2025-10-06', 'fd', 'fdf', '', 30150, 4.00, 2713.86, 2713.86, 0.00, 35581.72, 'Partial', '2025-10-30 13:37:51', 12, 28, NULL),
('ME/2025-26/024', 'akshay wadi', '2025-10-21', '2025-10-21', 'adn', 'dj', 'd,', 560120, 9.00, 0, 0, 100823.22, 660952.22, 'Paid', '2025-10-30 13:42:46', 9, 29, NULL),
('ME/2025-26/026', 'samiksha', '2025-10-23', '2025-10-27', 'm', 'rdf', 'fjv', 36916, 90.00, 3330.54, 3330.54, 0.00, 43667.08, 'Partial', '2025-10-30 13:46:27', 12, 30, NULL),
('ME/2025-26/028', 'samiksha', '2025-10-30', '2025-10-31', 'wkjf', 'fj', 'fdg', 405237, 97.00, 36480.06, 36480.06, 0.00, 478294.12, 'Paid', '2025-10-30 13:47:20', 12, 31, NULL),
('ME/2025-26/035', 'samiksha chaudh', '2025-10-31', '2025-10-30', 'hjh', 'jh', '', 130444, 97.00, 0, 0, 23497.38, 154038.38, 'Partial', '2025-10-31 10:51:27', 13, 32, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `invoice_items`
--

CREATE TABLE `invoice_items` (
  `item_id` int(11) NOT NULL,
  `invoice_id` int(11) DEFAULT NULL,
  `item_detail` varchar(255) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `rate` double DEFAULT NULL,
  `discount` float DEFAULT NULL,
  `amount` float DEFAULT NULL,
  `uom_amount` decimal(10,2) DEFAULT 0.00,
  `uom_description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `invoice_items`
--

INSERT INTO `invoice_items` (`item_id`, `invoice_id`, `item_detail`, `quantity`, `rate`, `discount`, `amount`, `uom_amount`, `uom_description`) VALUES
(0, 0, 'jhjhhj', 7, 89, 0, 623, 0.00, NULL),
(0, 0, 'soap', 4, 250, 0, 1000, 0.00, NULL),
(0, 0, 'yuyyuy', 1, 0, 0, 0, 0.00, NULL),
(0, 0, '4', 76, 839, 0, 63764, 0.00, NULL),
(0, 0, '7', 788, 839, 0, 661132, 0.00, NULL),
(0, 0, '7', 44, 839, 0, 36916, 0.00, NULL),
(0, 4, '4', 97, 839, 0, 81383, 0.00, NULL),
(0, 5, '7', 87, 839, 0, 72993, 0.00, NULL),
(0, 5, '6', 11, 839, 0, 9229, 0.00, NULL),
(0, 5, '4', 98, 839, 0, 82222, 0.00, NULL),
(0, 6, '4', 55, 839, 0, 46145, 0.00, NULL),
(0, 7, '6', 86, 839, 0, 72154, 0.00, NULL),
(0, 8, '', 0, 0, 0, 0, 0.00, NULL),
(0, 9, 'werer', 75, 839, 0, 62925, 0.00, NULL),
(0, 10, 'fdfgdf', 2147483647, 839, 0, 8.22135e15, 0.00, NULL),
(0, 11, 'jkh', 8, 780, 0, 6240, 0.00, NULL),
(0, 12, '1', 45, 780, 0, 35100, 0.00, 'sq,mn'),
(0, 13, '1', 78, 780, 0, 60840, 0.00, 'hghg'),
(0, 15, 'Test Item', 1, 100, 0, 100, 0.00, 'pcs'),
(0, 18, 'Test Item', 2, 1000, 0, 2000, 0.00, 'pcs'),
(0, 19, 'Test Item', 2, 1000, 0, 2000, 0.00, 'pcs'),
(0, 21, '11', 5, 7000, 0, 35000, 0.00, 'cm'),
(0, 22, '11', 45, 7000, 0, 315000, 0.00, 'cm'),
(0, 23, '11', 4545, 7000, 0, 31815000, 0.00, 'cm'),
(0, 24, '11', 44, 7000, 0, 308000, 0.00, 'cm'),
(0, 25, '11', 44, 7000, 0, 308000, 0.00, 'cm'),
(0, 26, '12', 76, 340, 0, 25840, 0.00, 'cm'),
(0, 27, '11', 96, 7000, 0, 672000, 0.00, 'cm'),
(0, 28, '12', 45, 670, 0, 30150, 0.00, 'cm'),
(0, 29, '12', 836, 670, 0, 560120, 0.00, 'cm'),
(0, 30, '6', 44, 839, 0, 36916, 0.00, ''),
(0, 31, '6', 483, 839, 0, 405237, 0.00, ''),
(0, 32, 'payal', 87, 670, 0, 58290, 0.00, 'cm'),
(0, 32, 'lime ', 86, 839, 0, 72154, 0.00, '');

-- --------------------------------------------------------

--
-- Table structure for table `payment_entries`
--

CREATE TABLE `payment_entries` (
  `payment_id` int(11) NOT NULL,
  `invoice_id` int(11) NOT NULL,
  `invoice_number` varchar(20) NOT NULL,
  `payment_date` date NOT NULL,
  `payment_mode` enum('Online','Cash','Cheque') NOT NULL DEFAULT 'Cash',
  `currency` varchar(10) NOT NULL DEFAULT 'INR',
  `amount` decimal(10,2) NOT NULL,
  `invoice_total` decimal(10,2) NOT NULL,
  `remaining_balance` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `financial_year_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payment_entries`
--

INSERT INTO `payment_entries` (`payment_id`, `invoice_id`, `invoice_number`, `payment_date`, `payment_mode`, `currency`, `amount`, `invoice_total`, `remaining_balance`, `created_at`, `updated_at`, `financial_year_id`) VALUES
(1, 6, 'INV-000006', '2025-10-02', 'Cash', 'INR', 20000.00, 54451.10, 0.00, '2025-10-03 15:44:15', '2025-10-15 07:36:18', 4),
(2, 5, 'INV-000005', '2025-09-28', 'Cash', 'INR', 24000.00, 194043.92, 0.00, '2025-10-03 16:02:55', '2025-10-14 08:48:26', 4),
(3, 3, 'INV-000000', '2025-10-01', 'Cash', 'INR', 45000.00, 43560.88, -1439.12, '2025-10-04 11:06:59', '2025-10-14 08:48:22', 4),
(4, 9, 'ME/2023-24/002', '2025-10-13', 'Cash', 'INR', 8787.00, 74251.50, 0.00, '2025-10-14 08:48:53', '2025-10-15 07:25:39', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `products_services`
--

CREATE TABLE `products_services` (
  `id` int(11) NOT NULL,
  `type` enum('Product','Service') NOT NULL,
  `product_name` varchar(100) NOT NULL,
  `sku` varchar(50) DEFAULT NULL,
  `tax_applicable` varchar(100) DEFAULT NULL,
  `status` enum('Active','Inactive') DEFAULT 'Active',
  `category` varchar(100) DEFAULT NULL,
  `unit` varchar(50) DEFAULT NULL,
  `sale_price` decimal(10,2) DEFAULT NULL,
  `sale_discount` decimal(5,2) DEFAULT NULL,
  `sale_discount_type` enum('%','Flat') DEFAULT '%',
  `sale_description` text DEFAULT NULL,
  `purchase_price` decimal(10,2) DEFAULT NULL,
  `purchase_discount` decimal(5,2) DEFAULT NULL,
  `purchase_discount_type` enum('%','Flat') DEFAULT '%',
  `purchase_description` text DEFAULT NULL,
  `preferred_vendor` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products_services`
--

INSERT INTO `products_services` (`id`, `type`, `product_name`, `sku`, `tax_applicable`, `status`, `category`, `unit`, `sale_price`, `sale_discount`, `sale_discount_type`, `sale_description`, `purchase_price`, `purchase_discount`, `purchase_discount_type`, `purchase_description`, `preferred_vendor`, `created_at`) VALUES
(1, 'Product', 'jkh', 'JKH78744', '2', 'Inactive', 'jkjh', 'cm', 780.00, 10.00, '%', 'khk', 78.00, 2.00, '%', 'jhhjkj', 'Laxmi Motors', '2025-07-16 16:31:18'),
(2, 'Product', 'jkh', 'JKH44428', '2', 'Active', 'jkjh', 'cm', 0.00, 10.00, '%', '', 78.00, 2.00, '%', '', '', '2025-07-16 16:32:24'),
(3, 'Product', 'jhgjhgjgjhgjhgjhghj', 'JHG85565', '', 'Active', '', '', 0.00, 0.00, '%', '', 0.00, 0.00, '%', '', '', '2025-07-16 16:33:05'),
(4, 'Product', 'werer', 'WER97809', '3', 'Active', 'hkkhkj', '', 839.00, 10.00, '%', 'jdfjd', 7.00, 9.00, '%', '', '', '2025-07-23 16:16:37'),
(5, 'Product', 'fdfgdf', 'FDF66789', '2', 'Active', 'nm', '', 839.00, 10.00, '%', 'kjfjf', 76.00, 12.00, '%', 'fjk', 'Laxmi Motors', '2025-08-12 07:02:46'),
(6, 'Product', 'lime ', 'LIM82189', '', 'Active', 'cho', '', 839.00, 10.00, '%', 'hfkl', 76.00, 10.00, '%', 'no', 'raju ramesh pise', '2025-08-20 07:41:22'),
(7, 'Product', 'watch', 'WAT08566', '', 'Inactive', 'electronic', '', 839.00, 10.00, '%', 'hfjjd', 87.00, 0.00, '%', '8ry', 'raju ramesh pise', '2025-08-20 09:41:48'),
(8, 'Product', 'fdfgdf', 'FDF15312', '2', 'Active', 'jhdjh', '', 0.00, 10.00, 'Flat', 'hjhjh', 89.00, 89.00, '%', 'jhjh', 'ANUSH RssAaaaaJU PISE', '2025-09-20 09:28:35'),
(9, 'Product', 'kjnhbh', 'KJN38043', '3', 'Active', 'kj', 'cm', 0.00, 0.00, 'Flat', 'lk', 0.00, 0.00, '%', 'lk', 'ANUSH RAaaaaJU PISE', '2025-10-17 10:27:18'),
(10, 'Product', 'Test Product with Unit', NULL, NULL, 'Active', NULL, 'kg', 1500.00, NULL, '%', NULL, NULL, NULL, '%', NULL, NULL, '2025-10-17 10:41:49'),
(11, 'Product', 'final', 'FIN26722', '2', 'Active', 'j', 'cm', 7000.00, 10.00, '%', 'no', 700.00, 0.00, '%', 'jhh', 'akshay wadi', '2025-10-22 10:40:26'),
(12, 'Product', 'payal', 'PAY77352', '2', 'Active', 'sduhc', 'cm', 670.00, 10.00, '%', 'ihdh', 500.00, 10.00, '%', 'kjsd', 'ANUSH RAaaaaJU PISE', '2025-10-30 12:56:17');

-- --------------------------------------------------------

--
-- Table structure for table `product_units`
--

CREATE TABLE `product_units` (
  `id` int(11) NOT NULL,
  `unit_name` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_units`
--

INSERT INTO `product_units` (`id`, `unit_name`, `created_at`) VALUES
(1, 'cm', '2025-10-18 17:49:53'),
(2, 'mm', '2025-10-18 17:49:53'),
(3, 'kg', '2025-10-18 17:49:53'),
(4, 'pcs', '2025-10-18 17:49:53'),
(5, 'liters', '2025-10-18 17:49:53'),
(6, 'gm', '2025-10-18 17:49:53'),
(7, 'box', '2025-10-18 17:49:53'),
(8, 'dozen', '2025-10-18 17:49:53');

-- --------------------------------------------------------

--
-- Table structure for table `purchase_orders`
--

CREATE TABLE `purchase_orders` (
  `id` int(11) NOT NULL,
  `purchase_order_no` varchar(50) DEFAULT NULL,
  `delivery_to` enum('organization','customer') DEFAULT NULL,
  `delivery_address` text DEFAULT NULL,
  `vendor_name` varchar(100) DEFAULT NULL,
  `purchase_order_date` date DEFAULT NULL,
  `delivery_date` date DEFAULT NULL,
  `payment_terms` varchar(100) DEFAULT NULL,
  `due_date` date DEFAULT NULL,
  `customer_notes` text DEFAULT NULL,
  `terms_and_conditions` text DEFAULT NULL,
  `sub_total` decimal(10,2) DEFAULT NULL,
  `freight` decimal(10,2) DEFAULT 0.00,
  `cgst` decimal(10,2) DEFAULT NULL,
  `sgst` decimal(10,2) DEFAULT NULL,
  `total` decimal(10,2) DEFAULT NULL,
  `attachment` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `vendor_id` int(11) DEFAULT NULL,
  `financial_year_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `purchase_orders`
--

INSERT INTO `purchase_orders` (`id`, `purchase_order_no`, `delivery_to`, `delivery_address`, `vendor_name`, `purchase_order_date`, `delivery_date`, `payment_terms`, `due_date`, `customer_notes`, `terms_and_conditions`, `sub_total`, `freight`, `cgst`, `sgst`, `total`, `attachment`, `created_at`, `vendor_id`, `financial_year_id`) VALUES
(18, '9876543', 'organization', 'Laxmi Enterprises,\nNagpur, Maharashtra, 200145', 'raju ramesh pise', '2025-09-08', '2025-09-01', 'Due end of the month', '2025-09-18', 'sdfgh', 'adfghjk', 528840.00, 0.00, 47595.60, 47595.60, 624031.20, '', '2025-09-07 03:32:46', NULL, 4),
(19, '567', 'organization', 'Laxmi Enterprises,\nNagpur, Maharashtra, 200145', 'raju ramesh pise', '2025-09-23', '2025-09-10', 'Net 30', '2025-09-03', 'kj', 'ojk', 28526.00, 0.00, 2567.34, 2567.34, 33660.68, '', '2025-09-07 03:43:46', NULL, 4),
(20, '456', 'organization', 'Laxmi Enterprises,\nNagpur, Maharashtra, 200145', 'Anush Raju Pise', '2025-09-17', '2025-09-21', 'Net 15', '2025-09-17', 'sdf', 'sdd', 381745.00, 0.00, 34357.05, 34357.05, 450459.10, '', '2025-09-08 09:59:15', NULL, 4),
(21, '0987', 'organization', 'Laxmi Enterprises,\nNagpur, Maharashtra, 200145', 'raju ramesh pise', '2025-09-09', '2025-09-07', 'Net 15', '2025-09-10', 'kjuyfghfghf', 'jhgg', 4763003.00, 0.00, 428670.27, 428670.27, 5620343.54, '', '2025-09-08 11:44:38', NULL, 4),
(22, '56', 'organization', 'Laxmi Enterprises,\nNagpur, Maharashtra, 200145', 'raju ramesh pise', '2025-09-21', '2025-09-02', 'Net 15', '2025-10-02', 'hf', 'g', 62925.00, 0.00, 5663.25, 5663.25, 74251.50, '', '2025-09-08 11:46:53', NULL, 4),
(23, '6', '', '', 'raju ramesh pise', '2025-09-02', '2025-09-22', 'Net 15', '0000-00-00', 'mnkj', '', 55374.00, 0.00, 4983.66, 4983.66, 65341.32, '', '2025-09-08 12:11:41', NULL, 4),
(24, '90', 'organization', 'Laxmi Enterprises,\nNagpur, Maharashtra, 200145', 'raju ramesh pise', '2025-09-17', '2025-09-17', 'Net 30', '2025-09-17', 'jhhj', 'jh', 73832.00, 0.00, 6644.88, 6644.88, 87121.76, '', '2025-09-08 12:21:17', NULL, 4),
(25, '9', 'organization', 'Laxmi Enterprises,\nNagpur, Maharashtra, 200145', 'raju ramesh pise', '2025-09-03', '2025-09-12', 'Net 15', '2025-09-12', 'jh', 'iiu', 73832.00, 0.00, 6644.88, 6644.88, 87121.76, '', '2025-09-08 16:48:18', NULL, 4),
(26, '99', 'organization', 'Laxmi Enterprises,\nNagpur, Maharashtra, 200145', 'Anush Raju Pise', '0000-00-00', '0000-00-00', 'Due end of the month', '0000-00-00', '', '', 66281.00, 0.00, 5965.29, 5965.29, 78211.58, '', '2025-09-08 17:01:36', NULL, 4),
(27, '050789', 'organization', 'Laxmi Enterprises,\nNagpur, Maharashtra, 200145', 'raju ramesh pise', '2025-09-16', '2025-09-17', 'Net 15', '2025-09-03', 'jh', 'j', 613860.00, 0.00, 55247.40, 55247.40, 724354.80, '', '2025-09-08 17:18:56', NULL, 4),
(28, '0000000000', 'organization', 'Laxmi Enterprises,\nNagpur, Maharashtra, 200145', 'raju ramesh pise', '0000-00-00', '0000-00-00', 'Due end of the month', '0000-00-00', 'hg', '', 63764.00, 0.00, 5738.76, 5738.76, 75241.52, '', '2025-09-08 17:25:56', NULL, 4),
(29, 'PO/2025-26/004', 'organization', 'Laxmi Enterprises,\nNagpur, Maharashtra, 200145', '', '0000-00-00', '0000-00-00', 'Due end of the month', '0000-00-00', '', '', 7984.00, 0.00, 718.56, 718.56, 9421.12, '', '2025-09-09 07:09:32', NULL, 4),
(30, 'PO/2025-26/007', 'organization', 'Laxmi Enterprises,\nNagpur, Maharashtra, 200145', 'Anush Raju Pise', '2025-09-14', '2025-09-22', 'Net 15', '2025-09-16', 'jhg', 'khg', 6612.00, 0.00, 595.08, 595.08, 7802.16, '', '2025-09-09 07:10:16', NULL, 4),
(31, 'PO/2025-26/014', 'organization', 'Laxmi Enterprises,\nNagpur, Maharashtra, 200145', 'raju ramesh pise', '0000-00-00', '0000-00-00', 'Due end of the month', '0000-00-00', 'jhg', 'kf', 532.00, 0.00, 47.88, 47.88, 627.76, '', '2025-09-09 10:33:04', NULL, 4),
(32, '', 'organization', 'Laxmi Enterprises,\nNagpur, Maharashtra, 200145', 'akshay wadi', '2025-09-01', '2025-09-08', 'Due on receipt', '2025-09-10', 'jgj', 'grgh', 42900.00, 0.00, 3861.00, 3861.00, 50622.00, '', '2025-09-12 09:18:16', NULL, 4),
(33, '', 'organization', 'Laxmi Enterprises,\nNagpur, Maharashtra, 200145', 'Anush Raju Pise', '2025-09-22', '2025-09-15', 'Due end of the month', '2025-09-18', 'hjh', 'hhjhhhhh', 72993.00, 0.00, 6569.37, 6569.37, 86131.74, '', '2025-09-12 09:21:00', NULL, 4),
(34, '', 'organization', 'Laxmi Enterprises,\nNagpur, Maharashtra, 200145', 'Anush Raju Pise', '2025-09-15', '2025-09-15', 'Due end of the month', '2025-09-17', 'hg', 'hhj', 60060.00, 0.00, 5405.40, 5405.40, 70870.80, '', '2025-09-12 09:22:10', NULL, 4),
(35, '', 'organization', 'Laxmi Enterprises,\nNagpur, Maharashtra, 200145', 'raju ramesh pise', '2025-09-08', '2025-09-21', 'Due end of the month', '2025-09-24', 'jhh', 'h', 5460.00, 0.00, 491.40, 491.40, 6442.80, '', '2025-09-12 09:24:54', NULL, 4),
(36, '', 'organization', 'Laxmi Enterprises,\nNagpur, Maharashtra, 200145', 'raju ramesh pise', '2025-09-07', '2025-09-16', 'Due end of the month', '2025-09-18', 'jh', 'jh', 75660.00, 0.00, 6809.40, 6809.40, 89278.80, '', '2025-09-12 09:28:42', NULL, 4),
(37, 'PO/2023-24/019', 'organization', 'Laxmi Enterprises,\nNagpur, Maharashtra, 200145', 'Anush Raju Pise', '2025-09-01', '2025-09-08', 'Due end of the month', '2025-09-25', '7', '67', 585416.00, 0.00, 52687.44, 52687.44, 690790.88, '', '2025-09-12 10:44:30', NULL, 4),
(38, 'PO/2023-24/022', 'organization', 'Laxmi Enterprises,\nNagpur, Maharashtra, 200145', 'raju ramesh pise', '2025-08-31', '2025-09-15', 'Due end of the month', '2025-09-02', '', '', 609.00, 0.00, 54.81, 54.81, 718.62, '', '2025-09-12 16:30:41', NULL, 4),
(39, 'PO/2023-24/025', 'organization', 'Laxmi Enterprises,\nNagpur, Maharashtra, 200145', '', '0000-00-00', '0000-00-00', 'Due end of the month', '2025-09-17', 'hgghg', 'hggggg', 6708.00, 0.00, 603.72, 603.72, 7915.44, '', '2025-09-12 17:48:36', NULL, 4),
(40, 'PO/2023-24/030', 'organization', 'Laxmi Enterprises,\nNagpur, Maharashtra, 200145', 'raju ramesh pise', '2025-09-07', '2025-09-09', 'Net 30', '2025-09-24', 'hjh', 'kjh', 67860.00, 0.00, 6107.40, 6107.40, 80074.80, '', '2025-09-15 11:21:02', NULL, 4),
(41, 'PO/2023-24/033', 'organization', 'Laxmi Enterprises,\nNagpur, Maharashtra, 200145', 'raju ramesh pise', '2025-09-10', '2025-09-16', 'Due end of the month', '2025-09-18', 'jhjkh', 'jhjhjh', 73832.00, 0.00, 6644.88, 6644.88, 87121.76, '', '2025-09-17 08:51:50', NULL, 4),
(42, 'PO/2023-24/036', 'organization', 'Laxmi Enterprises,\nNagpur, Maharashtra, 200145', 'Anush Raju Pise', '2025-09-15', '2025-09-15', 'Due end of the month', '2025-09-16', '', '', 99999999.99, 0.00, 99999999.99, 99999999.99, 99999999.99, '', '2025-09-17 11:04:43', NULL, 4),
(43, 'PO/2023-24/039', 'organization', 'Laxmi Enterprises,\nNagpur, Maharashtra, 200145', 'Anush Raju Pise', '2025-09-16', '2025-09-07', 'Due end of the month', '2025-09-17', 'jhjhh', 'khjhhjghg', 67080.00, 0.00, 6037.20, 6037.20, 79154.40, '', '2025-09-17 12:18:18', NULL, 4),
(44, 'PO/2023-24/042', 'organization', 'Laxmi Enterprises,\nNagpur, Maharashtra, 200145', 'akshay wadi', '2025-09-19', '2025-09-18', 'Net 15', '2025-09-18', 'ok', 'ok', 1678.00, 0.00, 151.02, 151.02, 1980.04, '', '2025-09-17 12:30:12', NULL, 4),
(45, 'PO/2023-24/045', 'organization', 'Laxmi Enterprises,\nNagpur, Maharashtra, 200145', 'ANUSH RAJU PISE', '2025-09-17', '2025-09-18', 'Net 15', '2025-09-25', 'ok', 'ok', 1678.00, 0.00, 151.02, 151.02, 1980.04, '', '2025-09-17 12:35:58', NULL, 4),
(46, 'PO/2023-24/045', 'organization', 'Laxmi Enterprises,\nNagpur, Maharashtra, 200145', 'ANUSH RAJU PISE', '2025-09-17', '2025-09-18', 'Net 15', '2025-09-25', 'ok', 'ok', 1678.00, 0.00, 151.02, 151.02, 1980.04, '', '2025-09-17 12:36:06', NULL, 4),
(47, 'PO/2023-24/049', 'organization', 'Laxmi Enterprises,\nNagpur, Maharashtra, 200145', 'raju ramesh pise', '0000-00-00', '0000-00-00', 'Due end of the month', '0000-00-00', 'kjjhg', 'kuiyg', 60408.00, 0.00, 5436.72, 5436.72, 71281.44, '', '2025-09-17 12:38:41', NULL, 4),
(48, 'PO/2023-24/049', 'organization', 'Laxmi Enterprises,\nNagpur, Maharashtra, 200145', 'raju ramesh pise', '2025-09-01', '2025-09-07', 'Due end of the month', '2025-09-20', 'kjjhg', 'kuiyg', 60408.00, 0.00, 5436.72, 5436.72, 71281.44, '', '2025-09-17 12:39:03', NULL, 4),
(49, 'PO/2023-24/049', 'organization', 'Laxmi Enterprises,\nNagpur, Maharashtra, 200145', 'raju ramesh pise', '2025-09-01', '2025-09-07', 'Due end of the month', '2025-09-20', 'kjjhg', 'kuiyg', 60408.00, 0.00, 5436.72, 5436.72, 71281.44, '', '2025-09-17 12:46:23', NULL, 4),
(50, '', 'organization', 'Laxmi Enterprises,\nNagpur, Maharashtra, 200145', 'raju ramesh pise', '2025-09-02', '2025-09-22', 'Due end of the month', '2025-09-23', 'kjh', 'kjkhj', 67080.00, 0.00, 6037.20, 6037.20, 79154.40, '', '2025-09-17 12:52:37', NULL, 4),
(51, '', 'organization', 'Laxmi Enterprises,\nNagpur, Maharashtra, 200145', 'raju ramesh pise', '2025-09-25', '2025-09-14', 'Due end of the month', '2025-09-15', 'hjjkh', 'jhjh', 59280.00, 0.00, 5335.20, 5335.20, 69950.40, '', '2025-09-18 07:48:48', NULL, 4),
(52, 'INV-0000028989887877', 'organization', 'Laxmi Enterprises,\nNagpur, Maharashtra, 200145', 'raju ramesh pise', '2025-10-13', '2025-10-19', 'Due end of the month', '2025-10-13', 'j', 'jh', 5460.00, 0.00, 491.40, 491.40, 6442.80, '', '2025-10-09 18:17:04', NULL, NULL),
(53, 'INV-000002898988787789', 'organization', 'Laxmi Enterprises,\nNagpur, Maharashtra, 200145', 'raju ramesh pise', '2025-10-13', '2025-10-27', 'Due on receipt', '2025-09-30', 'j', '', 873.00, 0.00, 78.57, 78.57, 1030.14, '', '2025-10-09 18:18:33', NULL, NULL),
(54, 'INV-000002898988787789', 'organization', 'Laxmi Enterprises,\nNagpur, Maharashtra, 200145', 'raju ramesh pise', '2025-10-13', '2025-10-27', 'Due on receipt', '2025-09-30', 'j', '', 873.00, 0.00, 78.57, 78.57, 1030.14, '', '2025-10-09 18:18:33', NULL, NULL),
(55, 'INV-000002898988787773784', 'organization', 'Laxmi Enterprises,\nNagpur, Maharashtra, 200145', 'Anush Raju Pise', '2023-12-12', '2025-10-08', 'Due on receipt', '2025-10-08', 'w', 'd', 1560.00, 0.00, 140.40, 140.40, 1840.80, '', '2025-10-09 18:20:20', NULL, NULL),
(56, 'PO/2025-26/015', NULL, NULL, 'Test Vendor', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, NULL, NULL, NULL, NULL, '2025-10-13 17:07:17', NULL, NULL),
(57, '9840984879834', 'organization', 'Laxmi Enterprises,\nNagpur, Maharashtra, 200145', 'raju ramesh pise', '2025-10-01', '2025-10-16', 'Net 15', '2025-10-21', 'jkhf', 'lkjf', 81383.00, 0.00, 7324.47, 7324.47, 96031.94, '', '2025-10-14 10:45:09', NULL, NULL),
(58, '4534', 'organization', 'Laxmi Enterprises,\nNagpur, Maharashtra, 200145', 'raju ramesh pise', '2025-10-07', '2025-10-02', 'Net 30', '2025-09-28', '534', '4354543', 268320.00, 0.00, 24148.80, 24148.80, 316617.60, '', '2025-10-14 10:48:12', NULL, NULL),
(59, '8768767-978', 'organization', 'Laxmi Enterprises,\nNagpur, Maharashtra, 200145', 'raju ramesh pise', '2025-09-30', '2025-09-29', 'Net 15', '2025-10-13', 'kjhg', ',jk', 77220.00, 0.00, 6949.80, 6949.80, 91119.60, '', '2025-10-14 11:23:49', NULL, NULL),
(60, '8768767-978', 'organization', 'Laxmi Enterprises,\nNagpur, Maharashtra, 200145', 'raju ramesh pise', '2025-09-30', '2025-09-29', 'Net 15', '2025-10-13', 'kjhg', ',jk', 77220.00, 0.00, 6949.80, 6949.80, 91119.60, '', '2025-10-14 11:28:44', NULL, NULL),
(61, 'jkhdf842', 'organization', 'Laxmi Enterprises,\nNagpur, Maharashtra, 200145', 'kasturi', '2025-10-30', '2025-10-22', 'Net 15', '2025-10-21', 'ansakjs', '• Payment Terms: 100% After Delivery.\n• PO Validity : 4 Month\n• Delivery: 1 to 2 Weeks (Immediate)\n• Document Required: Test Certificate', 4690.00, 97.00, 430.83, 430.83, 5648.66, '', '2025-10-31 07:30:28', NULL, NULL),
(62, 'ihg95984', 'organization', 'Laxmi Enterprises,\nNagpur, Maharashtra, 200145', 'kasturi', '2025-10-31', '2025-10-31', 'Net 15', '2025-10-31', 'kjfgnjkng', '• Payment Terms: 100% After Delivery.\n• PO Validity : 4 Month\n• Delivery: 1 to 2 Weeks (Immediate)\n• Document Required: Test Certificate', 832445.00, 88.00, 74927.97, 74927.97, 982388.94, '', '2025-10-31 07:52:45', NULL, NULL),
(63, 'djhsdjhf878', '', '', 'kasturi', '2025-10-30', '2025-10-30', 'Net 15', '0000-00-00', 'kjjh', '', 429520.00, 54.00, 38661.66, 38661.66, 506897.32, '', '2025-10-31 08:17:02', NULL, NULL),
(64, '99999999999', '', '', 'kasturi', '2025-10-30', '2025-10-30', 'Net 15', '0000-00-00', '', '', 58960.00, 96.00, 5315.04, 5315.04, 69686.08, '', '2025-10-31 09:13:05', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `purchase_order_items`
--

CREATE TABLE `purchase_order_items` (
  `id` int(11) NOT NULL,
  `purchase_order_id` int(11) DEFAULT NULL,
  `item_name` varchar(100) DEFAULT NULL,
  `qty` int(11) DEFAULT NULL,
  `rate` decimal(10,2) DEFAULT NULL,
  `discount` decimal(10,2) DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `uom_amount` decimal(10,2) DEFAULT 0.00,
  `uom_description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `purchase_order_items`
--

INSERT INTO `purchase_order_items` (`id`, `purchase_order_id`, `item_name`, `qty`, `rate`, `discount`, `amount`, `uom_amount`, `uom_description`) VALUES
(19, 18, NULL, 678, 780.00, 0.00, 528840.00, 0.00, NULL),
(20, 19, NULL, 34, 839.00, 0.00, 28526.00, 0.00, NULL),
(21, 20, NULL, 455, 839.00, 0.00, 381745.00, 0.00, NULL),
(22, 21, NULL, 5677, 839.00, 0.00, 4763003.00, 0.00, NULL),
(23, 22, NULL, 75, 839.00, 0.00, 62925.00, 0.00, NULL),
(24, 23, '4', 66, 839.00, 0.00, 55374.00, 0.00, NULL),
(25, 24, '7', 88, 839.00, 0.00, 73832.00, 0.00, NULL),
(26, 25, 'fdfgdf', 88, 839.00, 0.00, 73832.00, 0.00, NULL),
(27, 26, NULL, 79, 839.00, 0.00, 66281.00, 0.00, NULL),
(28, 27, '1', 787, 780.00, 0.00, 613860.00, 0.00, NULL),
(29, 28, 'werer', 76, 839.00, 0.00, 63764.00, 0.00, NULL),
(30, 29, 'lime ', 8, 998.00, 0.00, 7984.00, 0.00, NULL),
(31, 30, 'lime ', 76, 87.00, 0.00, 6612.00, 0.00, NULL),
(32, 31, 'werer', 7, 76.00, 0.00, 532.00, 0.00, NULL),
(33, 32, NULL, 55, 780.00, 0.00, 42900.00, 0.00, NULL),
(34, 33, NULL, 87, 839.00, 0.00, 72993.00, 0.00, NULL),
(35, 34, NULL, 77, 780.00, 0.00, 60060.00, 0.00, NULL),
(36, 35, NULL, 7, 780.00, 0.00, 5460.00, 0.00, NULL),
(37, 36, NULL, 97, 780.00, 0.00, 75660.00, 0.00, NULL),
(38, 37, NULL, 676, 866.00, 0.00, 585416.00, 0.00, NULL),
(39, 38, NULL, 87, 7.00, 0.00, 609.00, 0.00, NULL),
(40, 39, NULL, 78, 86.00, 0.00, 6708.00, 0.00, NULL),
(41, 40, 'jkh', 87, 780.00, 0.00, 67860.00, 0.00, NULL),
(42, 41, NULL, 88, 839.00, 0.00, 73832.00, 0.00, NULL),
(43, 42, NULL, 2147483647, 780.00, 0.00, 99999999.99, 0.00, NULL),
(44, 43, NULL, 86, 780.00, 0.00, 67080.00, 0.00, NULL),
(45, 44, '', 2, 839.00, 0.00, 1678.00, 0.00, NULL),
(46, 50, '1', 86, 780.00, 0.00, 67080.00, 0.00, NULL),
(47, 51, 'jkh', 76, 780.00, 0.00, 59280.00, 0.00, NULL),
(48, 52, '1', 7, 780.00, 0.00, 5460.00, 0.00, NULL),
(49, 53, '3', 97, 9.00, 0.00, 873.00, 0.00, NULL),
(50, 54, '3', 97, 9.00, 0.00, 873.00, 0.00, NULL),
(51, 55, '1', 2, 780.00, 0.00, 1560.00, 0.00, NULL),
(52, 56, 'Bolt', 2, 5.00, 0.00, 10.00, 0.00, NULL),
(53, 57, '4', 97, 839.00, 0.00, 81383.00, 0.00, NULL),
(54, 58, '1', 344, 780.00, 0.00, 268320.00, 0.00, NULL),
(55, 60, '1', 99, 780.00, 0.00, 77220.00, 0.00, 'jhjh'),
(56, 61, '12', 7, 670.00, 0.00, 4690.00, 0.00, 'cm'),
(57, 62, '12', 9, 670.00, 0.00, 6030.00, 0.00, 'cm'),
(58, 62, '6', 985, 839.00, 0.00, 826415.00, 0.00, ''),
(59, 63, 'payal', 56, 670.00, 0.00, 37520.00, 0.00, 'cm'),
(60, 63, 'final', 56, 7000.00, 0.00, 392000.00, 0.00, 'cm'),
(61, 64, 'payal', 88, 670.00, 0.00, 58960.00, 0.00, 'cm');

-- --------------------------------------------------------

--
-- Table structure for table `quotation`
--

CREATE TABLE `quotation` (
  `quotation_id` int(11) NOT NULL,
  `customer_name` varchar(255) NOT NULL,
  `quotation_date` date NOT NULL,
  `expiry_date` date NOT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `customer_notes` text DEFAULT NULL,
  `terms_and_conditions` text DEFAULT NULL,
  `sub_total` double DEFAULT NULL,
  `freight` decimal(10,2) DEFAULT 0.00,
  `cgst` double DEFAULT NULL,
  `sgst` double DEFAULT NULL,
  `igst` decimal(10,2) DEFAULT 0.00,
  `attachment_url` varchar(500) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `grand_total` int(255) DEFAULT NULL,
  `status` enum('Draft','Sent') DEFAULT 'Draft',
  `quote_number` varchar(20) DEFAULT NULL,
  `financial_year_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `quotation`
--

INSERT INTO `quotation` (`quotation_id`, `customer_name`, `quotation_date`, `expiry_date`, `subject`, `customer_notes`, `terms_and_conditions`, `sub_total`, `freight`, `cgst`, `sgst`, `igst`, `attachment_url`, `created_at`, `grand_total`, `status`, `quote_number`, `financial_year_id`) VALUES
(2, 'rdj', '2025-08-18', '2025-09-18', 'lsdsdjxmcnx', 'Thanks for your business.', 'ffgf', 380225, 0.00, 34220.25, 34220.25, 0.00, NULL, '2025-08-20 09:23:47', 448666, 'Sent', 'QT-000002', 4),
(6, 'ANUSH RAJU PISE', '2025-08-21', '2025-09-21', '', 'Thanks for your business.', '', 0, 0.00, 0, 0, 0.00, NULL, '2025-08-29 10:33:23', 0, 'Draft', 'QT-000006', 4),
(7, 'Emily Johnson', '2025-08-20', '2025-09-20', 'iuiuiuiu', 'Thanks for your business.', 'iuiu', 0, 0.00, 0, 0, 0.00, '', '2025-08-30 10:55:16', 0, 'Draft', 'QT-000007', 4),
(8, 'Emily Johnson', '2025-08-21', '2025-09-21', 'llfly', 'Thanks for your business.', 'uyuyr', 0, 0.00, 0, 0, 0.00, NULL, '2025-08-30 10:56:33', 0, 'Sent', 'QT-000008', 4),
(9, 'akshay wadi', '2025-08-21', '2025-09-21', 'fkjhfdkjghj', 'Thanks for your business.', 'kjhfksdjhfgjkdh', 0, 0.00, 0, 0, 0.00, NULL, '2025-09-02 11:38:49', 0, 'Sent', 'QT-000009', 4),
(10, 'akshay wadi', '2025-08-21', '2025-09-21', 'kljhhjh', 'hjhjhThanks for your business.', '', 828093, 0.00, 74528.37, 74528.37, 0.00, NULL, '2025-09-02 12:18:29', 977150, 'Sent', 'QT-000010', 4),
(11, 'akshay wadi', '2025-08-21', '2025-09-21', 'kjkjkjkjkj', 'Thanks for your business.', '', 7297622, 0.00, 656785.98, 656785.98, 0.00, NULL, '2025-09-02 12:27:43', 8611194, 'Sent', 'QT-000011', 4),
(12, 'Dr. Rahul Mehra', '2025-08-21', '2025-09-21', '', 'Thanks for your business.', '', 0, 0.00, 0, 0, 0.00, NULL, '2025-09-04 18:16:01', 0, 'Sent', 'QT-000012', 4),
(13, 'Dr. Rahul Mehra', '2025-08-21', '2025-09-21', 'klndf', 'Thanks for your business.', 'kjdfhsdg', 7337894, 0.00, 660410.46, 660410.46, 0.00, NULL, '2025-09-05 07:56:07', 8658715, 'Sent', 'QT-000013', 4),
(14, 'Anush Raju Pise', '2025-08-21', '2025-09-21', 'uyui', 'Thanks for your business.', '', 145986, 0.00, 13138.74, 13138.74, 0.00, NULL, '2025-09-06 11:25:36', 172263, 'Sent', 'ME/BESPL/001/2025-26', 4),
(15, 'Dr. Rahul Mehra', '2025-08-21', '2025-09-21', 'lkj', 'Thanks for your business.', 'Delivery Period: 3 to 4 weeks from the date of technically and commercially clear order.\nInstallation Period: 2 to 3 weeks\nTransportation: Extra at Actual\nPayment Terms:\na) 30% Advance along with Purchase order\nb) 65% Against proforma invoice prior to dispatch\nc) 5% after successfull Installation and commissioning\nWarranty: Offer a standard warranty of 15 months from date of dispatch or 12 months from date of satisfactory installation whichever is earlier\nValidity: Our offer shall remain valid for 15 days\nExclusions: Civil work, MS work, Loading / Unloading at site, Power supply, Adequate lighting arrangement for installation activities, Scrap folding, Scissor lift.', 683280, 0.00, 61495.2, 61495.2, 0.00, NULL, '2025-09-09 10:37:47', 806270, 'Sent', 'ME/BESPL/002/2025-26', 4),
(16, 'Dr. Rahul Mehra', '2025-08-14', '2025-09-09', 'kj', 'Thanks for your business.', 'Delivery Period: 3 to 4 weeks from the date of technically and commercially clear order.\nInstallation Period: 2 to 3 weeks\nTransportation: Extra at Actual\nPayment Terms:\na) 30% Advance along with Purchase order\nb) 65% Against proforma invoice prior to dispatch\nc) 5% after successfull Installation and commissioning\nWarranty: Offer a standard warranty of 15 months from date of dispatch or 12 months from date of satisfactory installation whichever is earlier\nValidity: Our offer shall remain valid for 15 days\nExclusions: Civil work, MS work, Loading / Unloading at site, Power supply, Adequate lighting arrangement for installation activities, Scrap folding, Scissor lift.', 72154, 0.00, 6493.86, 6493.86, 0.00, NULL, '2025-09-18 09:13:25', 85142, 'Sent', 'ME/BESPL/001/2023-24', 4),
(17, 'Emily Johnson', '2025-08-21', '2025-09-21', 'jhlkjlkj', 'Thanks for your business.', 'Delivery Period: 3 to 4 weeks from the date of technically and commercially clear order.\nInstallation Period: 2 to 3 weeks\nTransportation: Extra at Actual\nPayment Terms:\na) 30% Advance along with Purchase order\nb) 65% Against proforma invoice prior to dispatch\nc) 5% after successfull Installation and commissioning\nWarranty: Offer a standard warranty of 15 months from date of dispatch or 12 months from date of satisfactory installation whichever is earlier\nValidity: Our offer shall remain valid for 15 days\nExclusions: Civil work, MS work, Loading / Unloading at site, Power supply, Adequate lighting arrangement for installation activities, Scrap folding, Scissor lift.', 63764, 0.00, 5738.76, 5738.76, 0.00, NULL, '2025-10-04 11:12:52', 75242, 'Sent', 'ME/BESPL/002/2023-24', 4),
(18, 'Jonhey ', '2025-08-19', '2025-09-19', 'hgf', 'Thanks for your business.', 'Delivery Period    : 3 to 4 weeks from the date of technically and commercially clear order.\nInstallation Period: 2 to 3 weeks\nTransportation     : Extra at Actual\nPayment Terms      : Supply/Installation Terms\n                     a) 30% Advance along with Purchase order\n                     b) 65% Against proforma invoice prior to dispatch\n                     c) 5% after successfull Installation and commissioning\nWarranty           : Offer a standard warranty of 15 months from date of dispatch or 12 months from date of\n                     satisfactory installation whichever is earlier\nValidity           : Our Offer shall remain valid for 15 days\nExclusions         : Civil work, MS work, Loading / Unloading at site, Power supply, Adequate lighting arrangem\n                     -ent for installation activities, Scrap folding, Scissor lift.', 0, 98.00, 0, 0, 17.64, '', '2025-10-22 10:42:49', 116, 'Draft', 'ME/BESPL/003/2025-26', NULL),
(19, 'samiksha chaudh', '2025-08-21', '2025-09-21', '', 'Thanks for your business.', 'Delivery Period    : 3 to 4 weeks from the date of technically and commercially clear order.\nInstallation Period: 2 to 3 weeks\nTransportation     : Extra at Actual\nPayment Terms      : Supply/Installation Terms\n                     a) 30% Advance along with Purchase order\n                     b) 65% Against proforma invoice prior to dispatch\n                     c) 5% after successfull Installation and commissioning\nWarranty           : Offer a standard warranty of 15 months from date of dispatch or 12 months from date of\n                     satisfactory installation whichever is earlier\nValidity           : Our Offer shall remain valid for 15 days\nExclusions         : Civil work, MS work, Loading / Unloading at site, Power supply, Adequate lighting arrangem\n                     -ent for installation activities, Scrap folding, Scissor lift.', 616000, 980.00, 0, 0, 111056.40, NULL, '2025-10-22 10:51:04', 728036, 'Sent', 'ME/BESPL/004/2025-26', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `quotation_items`
--

CREATE TABLE `quotation_items` (
  `item_id` int(11) NOT NULL,
  `quotation_id` int(11) DEFAULT NULL,
  `item_detail` varchar(255) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `rate` double DEFAULT NULL,
  `discount` float DEFAULT NULL,
  `amount` float DEFAULT NULL,
  `uom_amount` decimal(10,2) DEFAULT 0.00,
  `uom_description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `quotation_items`
--

INSERT INTO `quotation_items` (`item_id`, `quotation_id`, `item_detail`, `quantity`, `rate`, `discount`, `amount`, `uom_amount`, `uom_description`) VALUES
(1, 2, 'cks', 67, 5675, 0, 380225, 0.00, NULL),
(7, 6, NULL, NULL, 839, 0, 0, 0.00, NULL),
(9, 8, NULL, NULL, 839, 0, 0, 0.00, NULL),
(10, 9, NULL, NULL, 839, 0, 0, 0.00, NULL),
(11, 10, '7', 889, 839, 0, 745871, 0.00, NULL),
(12, 10, '4', 98, 839, 0, 82222, 0.00, NULL),
(13, 11, 'werer', 8698, 839, 0, 7297620, 0.00, NULL),
(14, 12, NULL, NULL, 839, 0, 0, 0.00, NULL),
(15, 13, 'fdfgdf', 8746, 839, 0, 7337890, 0.00, NULL),
(16, 14, 'werer', 87, 839, 0, 72993, 0.00, NULL),
(17, 14, 'fdfgdf', 87, 839, 0, 72993, 0.00, NULL),
(18, 15, 'jkh', 876, 780, 0, 683280, 0.00, NULL),
(19, 16, 'werer', 86, 839, 0, 72154, 0.00, NULL),
(20, 17, 'werer', 76, 839, 0, 63764, 0.00, NULL),
(22, 19, 'final', 88, 7000, 0, 616000, 0.00, 'cm');

-- --------------------------------------------------------

--
-- Table structure for table `taxes`
--

CREATE TABLE `taxes` (
  `id` int(11) NOT NULL,
  `tax_name` varchar(100) DEFAULT NULL,
  `tax_rate` decimal(5,2) DEFAULT NULL,
  `tax_code` varchar(50) DEFAULT NULL,
  `details` text DEFAULT NULL,
  `status` enum('Active','Inactive') DEFAULT 'Active',
  `effective_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `taxes`
--

INSERT INTO `taxes` (`id`, `tax_name`, `tax_rate`, `tax_code`, `details`, `status`, `effective_date`) VALUES
(1, 'gst 20', 19.00, 'jlkj', 'Effective from 2025-07-16', 'Inactive', '2025-07-15'),
(2, 'cGST', 10.00, 'thtrh', 'Effective from 2025-07-16', 'Active', '2025-07-16'),
(3, 'GST', 20.00, 'tech', 'Effective from 2025-07-23', 'Active', '2025-07-23'),
(4, 'GST', 100.00, 'nice', 'Effective from 2025-07-24', 'Active', '2025-07-24'),
(5, 'night tax', 78.00, 'no', 'Effective from 2025-08-20', 'Active', '2025-08-20');

-- --------------------------------------------------------

--
-- Table structure for table `uom_types`
--

CREATE TABLE `uom_types` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `conversion_factor` decimal(10,4) DEFAULT 1.0000,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `uom_types`
--

INSERT INTO `uom_types` (`id`, `name`, `description`, `conversion_factor`, `created_at`, `updated_at`) VALUES
(1, 'Pieces', 'Individual units or pieces', 1.0000, '2025-10-09 17:16:25', '2025-10-09 17:16:25'),
(2, 'Kilograms', 'Weight in kilograms', 1.0000, '2025-10-09 17:16:25', '2025-10-09 17:16:25'),
(3, 'Meters', 'Length in meters', 1.0000, '2025-10-09 17:16:25', '2025-10-09 17:16:25'),
(4, 'Liters', 'Volume in liters', 1.0000, '2025-10-09 17:16:25', '2025-10-09 17:16:25'),
(5, 'Hours', 'Time in hours', 1.0000, '2025-10-09 17:16:25', '2025-10-09 17:16:25'),
(6, 'Square Meters', 'Area in square meters', 1.0000, '2025-10-09 17:16:25', '2025-10-09 17:16:25'),
(7, 'Cubic Meters', 'Volume in cubic meters', 1.0000, '2025-10-09 17:16:25', '2025-10-09 17:16:25');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','superadmin') DEFAULT 'admin',
  `status` enum('Active','Inactive') DEFAULT 'Active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `role`, `status`, `created_at`) VALUES
(1, 'admin', '$2b$10$glRJI0l/694HauqYf0V4sOlXMAGT9MgVrAMpvwkZTo3/ockHsJfy6', 'admin', 'Active', '2025-10-07 18:06:04'),
(3, 'superadmin', '$2b$10$Sr.IihsiZGWxa.AUtSNehuO7uzJ0Axnj8LSopm4vBU1KXPBLorzH2', 'superadmin', 'Active', '2025-10-07 18:10:14');

-- --------------------------------------------------------

--
-- Table structure for table `vendors`
--

CREATE TABLE `vendors` (
  `id` int(11) NOT NULL,
  `vendor_name` varchar(255) DEFAULT NULL,
  `company_name` varchar(255) DEFAULT NULL,
  `display_name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `pan` varchar(20) DEFAULT NULL,
  `gst` varchar(20) DEFAULT NULL,
  `billing_recipient_name` varchar(255) DEFAULT NULL,
  `billing_country` varchar(100) DEFAULT NULL,
  `billing_address1` text DEFAULT NULL,
  `billing_address2` text DEFAULT NULL,
  `billing_city` varchar(100) DEFAULT NULL,
  `billing_state` varchar(100) DEFAULT NULL,
  `billing_pincode` varchar(20) DEFAULT NULL,
  `billing_fax` varchar(50) DEFAULT NULL,
  `billing_phone` varchar(20) DEFAULT NULL,
  `shipping_recipient_name` varchar(255) DEFAULT NULL,
  `shipping_country` varchar(100) DEFAULT NULL,
  `shipping_address1` text DEFAULT NULL,
  `shipping_address2` text DEFAULT NULL,
  `shipping_city` varchar(100) DEFAULT NULL,
  `shipping_state` varchar(100) DEFAULT NULL,
  `shipping_pincode` varchar(20) DEFAULT NULL,
  `shipping_fax` varchar(50) DEFAULT NULL,
  `shipping_phone` varchar(20) DEFAULT NULL,
  `account_holder_name` varchar(255) DEFAULT NULL,
  `bank_name` varchar(255) DEFAULT NULL,
  `account_number` varchar(50) DEFAULT NULL,
  `ifsc` varchar(20) DEFAULT NULL,
  `remark` text DEFAULT NULL,
  `status` enum('Active','Inactive') DEFAULT 'Active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `vendors`
--

INSERT INTO `vendors` (`id`, `vendor_name`, `company_name`, `display_name`, `email`, `phone`, `pan`, `gst`, `billing_recipient_name`, `billing_country`, `billing_address1`, `billing_address2`, `billing_city`, `billing_state`, `billing_pincode`, `billing_fax`, `billing_phone`, `shipping_recipient_name`, `shipping_country`, `shipping_address1`, `shipping_address2`, `shipping_city`, `shipping_state`, `shipping_pincode`, `shipping_fax`, `shipping_phone`, `account_holder_name`, `bank_name`, `account_number`, `ifsc`, `remark`, `status`) VALUES
(1, 'Anush Raju ', 'BD college wardha', 'khhjhkj', 'anshupise95@gmail.com', '07588674622', '', 'iuwueeeeeeeeeey', 'Maharashtra', 'India', 'KOCHER WARD HINGANGHAT', 'LIC OFFICE ROAD', 'Wardha', 'Maharashtra', '442001', '', '', 'jjhj', 'India', 'wardha', 'LIC OFFICE ROAD', 'Wardha', 'Maharashtra', '442001', '', '', 'starte bap', 'anshu', '1234567890', '123rty', 'sdfghjk', 'Active'),
(2, 'Anush Raju Pise', '', 'khhjhkj', 'anshupise95@gmail.com', '07588674622', '', 'iuwueeeeeeeeeey', NULL, '', 'KOCHER WARD HINGANGHAT', 'LIC OFFICE ROAD', 'Wardha', 'Maharashtra', '442001', '', NULL, NULL, 'India', 'wardha', 'LIC OFFICE ROAD', 'Wardha', 'Maharashtra', '442001', '', NULL, 'starte bap', 'anshu', '1234567890', '123rty', 'sdfghjk', 'Active'),
(3, 'raju ramesh pise', 'tech galaxy grow', 'kdjekljdekljdlekjdekdekdkj', 'rajupise001@gmail.com', '07823084754', 'ejdkjedkjeldelkj', 'jdejdlekjekekj', NULL, '', 'wardha', 'LIC OFFICE ROAD', 'Wardha', 'Maharashtra', '442001', '', NULL, NULL, '', 'wardha', 'LIC OFFICE ROAD', 'Wardha', 'Maharashtra', '442001', 'kjdlkeldejd', NULL, 'dleljhdejhdedhj', 'edejkedkejh', 'deejedh', 'djeldjehd', 'dhekjdejdhjedlejd', 'Active'),
(4, 'raju ramesh pise', 'tech galaxy grow', 'kdjekljdekljdlekjdekdekdkj', 'rajupise001@gmail.com', '07823084754', 'ejdkjedkjeldelkj', 'jdejdlekjekekj', 'arjun ', 'India', 'wardha', 'LIC OFFICE ROAD', 'Wardha', 'Maharashtra', '442001', '', '', 'not', 'India', 'wardha', 'LIC OFFICE ROAD', 'Wardha', 'Maharashtra', '442001', 'kjdlkeldejd', '', 'dleljhdejhdedhj', 'edejkedkejh', 'deejedh', 'djeldjehd', 'dhekjdejdhjedlejd', 'Active'),
(5, 'raju ramesh pise', 'tech galaxy grow', '', 'rajupise001@gmail.com', '07823084754', '', '', NULL, '', 'wardha', 'LIC OFFICE ROAD', 'Wardha', 'Maharashtra', '442001', '', NULL, NULL, '', 'wardha', 'LIC OFFICE ROAD', 'Wardha', 'Maharashtra', '442001', '', NULL, '', '', '', '', '', 'Active'),
(6, 'Anush Raju Pise', '', '', 'anshupise95@gmail.com', '07588674622', '', '', NULL, '', 'KOCHER WARD HINGANGHAT', 'LIC OFFICE ROAD', 'Wardha', 'Maharashtra', '442001', '', NULL, NULL, '', 'KOCHER WARD HINGANGHAT', 'LIC OFFICE ROAD', 'Wardha', 'Maharashtra', '442001', '', NULL, '', '', '', '', '', 'Active'),
(7, 'Anush Raju Pise', '', '', 'anshupise95@gmail.com', '07588674622', '', '', NULL, '', 'KOCHER WARD HINGANGHAT', 'LIC OFFICE ROAD', 'Wardha', 'Maharashtra', '442001', '', NULL, NULL, '', 'KOCHER WARD HINGANGHAT', 'LIC OFFICE ROAD', 'Wardha', 'Maharashtra', '442001', '', NULL, '', '', '', '', '', 'Active'),
(8, 'ANUSH RssAaaaaJU PISE', 'BD college wardha', '', 'anshupise95@gmail.com', '07823084754', '', '', 'jhkhjjh', 'India', 'kocher coloney hinganghat', 'lic office road', 'SEWAGRAM', 'Maharashtra', '442301', '', '', 'jjkjkjkj', 'India', 'kocher coloney hinganghat', 'lic office road', 'SEWAGRAM', 'Maharashtra', '442301', '', '07823084754', 'jhjhjh', 'jhjhh', 'jjkj', 'jkjkj', '', 'Active'),
(9, 'ANUSH RAaaaaJU PISE', 'BD college wardha', '', 'anshupise95@gmail.com', '07823084754', '', '', NULL, '', 'kocher coloney hinganghat', 'lic office road', 'SEWAGRAM', 'Maharashtra', '442301', '', NULL, NULL, '', '', '', '', '', '', '', NULL, '', '', '', '', '', 'Active'),
(10, 'ANUSH RAaaaaJU PISE', 'BD college wardha', '', 'anshupise95@gmail.com', '07823084754', '', '', NULL, '', 'kocher coloney hinganghat', 'lic office road', 'SEWAGRAM', 'Maharashtra', '442301', '', NULL, NULL, '', '', '', '', '', '', '', NULL, '', '', '', '', '', 'Active'),
(11, 'ANUSH RAJU PISE', 'BD college wardha', '', 'anshupise95@gmail.com', '07823084754', '', '', NULL, '', 'kocher coloney hinganghat', 'lic office road', 'SEWAGRAM', 'Maharashtra', '442301', '', NULL, NULL, 'USA', 'kocher coloney hinganghat', 'lic office road', 'SEWAGRAM', 'Maharashtra', '442301', '', NULL, 'asdfgh', 'ghsdfg', 'gdfgh', 'dfghj', 'dfgh', 'Active'),
(12, 'akshay wadi', 'cosmos digital', 'developer', 'anshupise95@gmail.com', '07823084754', '', 'jhfhfeuhgeughuihui', NULL, 'USA', 'kocher coloney hinganghat', 'lic office road', 'SEWAGRAM', 'Maharashtra', '442301', '8759875875', NULL, NULL, 'USA', 'kocher coloney hinganghat', 'lic office road', 'SEWAGRAM', 'Maharashtra', '442301', '', NULL, 'hfhskjdhfjks', 'jhfhsjhfsk', '897498374592347', 'shdfskjhdfj', 'hgjkdfhgdfhgjhdffsd', 'Active'),
(13, 'kasturi', 'kasturi enterprises', 'natingation', 'anshupise95@gmail.com', '07823084754', 'SDKJFD', 'SJDHFSJHD98498', NULL, 'India', 'kocher coloney hinganghat', 'lic office road', 'SEWAGRAM', 'Maharashtra', '442301', '983394834', NULL, NULL, 'India', 'kocher coloney hinganghat', 'lic office road', 'SEWAGRAM', 'Maharashtra', '442301', '983394834', NULL, 'jashdkjsdhfjshdf', 'sdkjfdjkfhs', '43843948398', 'SDKJFFEJH', 'dkjfwej', 'Active');

-- --------------------------------------------------------

--
-- Table structure for table `work_orders`
--

CREATE TABLE `work_orders` (
  `work_order_id` int(11) NOT NULL,
  `work_order_number` varchar(50) NOT NULL,
  `customer_name` varchar(255) NOT NULL,
  `work_order_date` date NOT NULL,
  `due_date` date NOT NULL,
  `payment_terms` varchar(100) DEFAULT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `customer_notes` text DEFAULT NULL,
  `terms_and_conditions` text DEFAULT NULL,
  `attachment_url` varchar(255) DEFAULT NULL,
  `sub_total` decimal(10,2) NOT NULL DEFAULT 0.00,
  `cgst` decimal(10,2) NOT NULL DEFAULT 0.00,
  `sgst` decimal(10,2) NOT NULL DEFAULT 0.00,
  `grand_total` decimal(10,2) NOT NULL DEFAULT 0.00,
  `status` varchar(50) DEFAULT 'Draft',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `purchase_order_number` varchar(100) DEFAULT NULL,
  `purchase_order_date` date DEFAULT NULL,
  `financial_year_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `work_orders`
--

INSERT INTO `work_orders` (`work_order_id`, `work_order_number`, `customer_name`, `work_order_date`, `due_date`, `payment_terms`, `subject`, `customer_notes`, `terms_and_conditions`, `attachment_url`, `sub_total`, `cgst`, `sgst`, `grand_total`, `status`, `created_at`, `updated_at`, `purchase_order_number`, `purchase_order_date`, `financial_year_id`) VALUES
(1, 'INV-000001', 'Dr. Rahul Mehra', '2025-06-20', '0000-00-00', NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, 0.00, 8283.60, 'Draft', '2025-07-28 16:13:08', '2025-10-08 09:22:37', NULL, NULL, 4),
(63, 'INV-00000', 'Dr. Rahul Mehra', '2025-06-21', '2025-06-30', 'Due end of the month', '', 'Thanks for your business.', '', '', 0.00, 0.00, 0.00, 0.00, 'Draft', '2025-09-04 12:47:19', '2025-10-08 09:22:37', '', '0000-00-00', 4),
(65, 'h', 'anshu ', '2025-06-21', '2025-06-30', 'Due end of the month', '', 'Thanks for your business.', '', '', 0.00, 0.00, 0.00, 0.00, 'Draft', '2025-09-04 12:51:51', '2025-10-08 09:22:37', '', '0000-00-00', 4),
(71, 'INV-0000014', 'Emily Johnson', '2025-06-21', '2025-06-30', 'Due end of the month', 'ajhshd', 'Thanks for your business.', 'ldkejd', '', 8390.00, 755.10, 755.10, 9900.20, 'Draft', '2025-09-05 07:00:35', '2025-10-08 09:22:37', 'kjekjr', '2025-09-11', 4),
(74, 'INV-0000019', 'Emily Johnson', '2025-06-21', '2025-06-30', 'Due end of the month', 'g', 'Thanks for your business.', 'u', '', 62086.00, 5587.74, 5587.74, 73261.48, 'Draft', '2025-09-12 17:47:02', '2025-10-08 09:22:37', '', '0000-00-00', 4),
(77, 'INV-0000078', 'ANUSH RAJU PISE', '2025-06-21', '2025-06-30', 'Due end of the month', 'kj', 'Thanks for your business.', 'uiuiu', '', 68473860.00, 6162647.40, 6162647.40, 80799154.80, 'Draft', '2025-09-17 10:29:43', '2025-10-08 09:22:37', '', '2025-09-03', 4),
(79, 'INV-00000100', 'anshu ', '2025-06-21', '2025-06-02', 'Net 15', 'kjgh', 'Thanks for your business.', 'lkgmklhymhlkym', '', 4195.00, 377.55, 377.55, 4950.10, 'Draft', '2025-09-18 11:17:52', '2025-10-08 09:22:37', '', '0000-00-00', 4),
(81, 'INV-00000199', 'Dr. Rahul Mehra', '2025-06-24', '2025-06-30', 'Due end of the month', 'iu', 'Thanks for your business.', 'uiuiu', '', 73832.00, 6644.88, 6644.88, 87121.76, 'Draft', '2025-10-03 04:05:27', '2025-10-08 09:22:37', '97899897', '2025-10-01', 4),
(82, 'INV-00000189', 'Anush Raju Pise', '2025-06-21', '2025-06-30', 'Net 15', 'kjfkj', 'kjThanks for your business.', '', '', 5873.00, 528.57, 528.57, 6930.14, 'Draft', '2025-10-03 07:47:40', '2025-10-08 09:22:37', '677777776788', '0000-00-00', 4),
(83, 'INV-000001878', 'ANUSH RAJU PISE', '2025-06-21', '2025-06-30', 'Due end of the month', 'kjk', 'Thanks for your business.', 'jkjh', '', 145986.00, 13138.74, 13138.74, 172263.48, 'Draft', '2025-10-03 07:53:36', '2025-10-08 09:22:37', '2355678900987654', '0000-00-00', 4),
(84, 'INV-00000189076', 'ANUSH RAJU PISE', '2025-06-21', '2025-06-30', 'Due end of the month', 'jhg', 'Thanks for your business.', 'ffh', '', 621102.00, 55899.18, 55899.18, 732900.36, 'Draft', '2025-10-03 07:57:30', '2025-10-08 09:22:37', '235567890098765478', '0000-00-00', 4),
(85, 'INV-0000019754856', 'Anush Raju Pise', '2025-06-21', '2025-06-30', 'Due end of the month', 'hjgrljkjh', 'Thanks for your business.', '', '', 734125.00, 66071.25, 66071.25, 866267.50, 'Draft', '2025-10-04 11:28:43', '2025-10-08 09:22:37', '4540979679008', '2025-10-06', 4),
(86, 'INV-00000876494', 'anshu ', '2023-12-14', '2025-06-30', 'Due end of the month', 'jhhj', 'Thanks for your business.', 'lkjjhg', '', 682500.00, 61425.00, 61425.00, 805350.00, 'Draft', '2025-10-08 10:20:34', '2025-10-08 10:20:34', '76478408750830', '2023-12-01', NULL),
(88, 'INV-00000167568975', 'Alice Smith', '2025-06-16', '2025-06-30', 'Net 15', '876767', 'Thanks for your business.', 'hghjg', '', 73568554.00, 6621169.86, 6621169.86, 86810893.72, 'Draft', '2025-10-08 10:21:50', '2025-10-08 10:21:50', '674576547654675', '2025-10-14', NULL),
(89, 'INV-00000176567654', 'ANUSH RAJU PISE', '2025-06-21', '2025-06-30', 'Due end of the month', '', 'Thanks for your business.', 'jvu', '', 0.00, 0.00, 0.00, 0.00, 'Draft', '2025-10-08 10:23:23', '2025-10-08 10:23:23', 'jhgjhghg8978768', '2025-10-01', NULL),
(90, 'INV-000001i387476476387', 'Dr. Rahul Mehra', '2025-12-11', '0000-00-00', NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, 0.00, 80523034.80, 'In Progress', '2025-10-09 08:13:27', '2025-10-22 11:39:08', NULL, NULL, NULL),
(91, 'INV-000001089879878', 'ANUSH RAJU PISE', '2023-12-14', '2025-06-30', 'Due end of the month', 'jhkj', 'Thanks for your business.', 'iu', '', 565486.00, 50893.74, 50893.74, 667273.48, 'Draft', '2025-10-09 17:28:05', '2025-10-09 17:28:05', 'yiuyoiuyuyoiuyoiuyui908798070980', '0000-00-00', NULL),
(92, '', 'ANUSH RAJU PISE', '2025-10-30', '0000-00-00', NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, 0.00, 6442.80, 'Completed', '2025-10-22 11:22:30', '2025-10-31 07:57:14', NULL, NULL, NULL),
(93, 'ME-00000198', 'akshay wadi', '2025-06-18', '2025-06-03', 'Due end of the month', 'jbcjh', 'Thanks for your business.', '* Advance Payment 20%\n* 80% payment will be done after 15 Days WCC Report.\n* Payment will be done as per work order.\n* Payment will be done as per measurement of Installation of Panel in Sq.Mtr.\n* Ensure minimum wastage of Materials.\n* The quality requirement of the work shall be qualified.\n* All the work will be carried out with safety equipment.\n* Wearing PPT Kit is compalsatory while working on site.\n* Chewing Gutkha, Smoking and Drinking Alcohol is not allowed while working on Site.\n* Child Labour is not allowed.\n* All the work will be done as per given drawing.\n* As per drawing, If any misconduct is observed the contractor shall be penalized.\n* All The Machines and Tools should be Ready with Safety Before Reaching on site.\n* After completion of installation debries cleaning is mandatory.', '', 768300.00, 69147.00, 69147.00, 906594.00, 'Draft', '2025-10-22 11:28:29', '2025-10-22 11:28:29', '98gjhjhh', '2025-12-26', NULL),
(94, 'ME-00000187', 'ANUSH RAJU PISE', '2025-12-24', '2025-06-30', 'Due end of the month', 'kjg', 'Thanks for your business.', '* Advance Payment 20%\n* 80% payment will be done after 15 Days WCC Report.\n* Payment will be done as per work order.\n* Payment will be done as per measurement of Installation of Panel in Sq.Mtr.\n* Ensure minimum wastage of Materials.\n* The quality requirement of the work shall be qualified.\n* All the work will be carried out with safety equipment.\n* Wearing PPT Kit is compalsatory while working on site.\n* Chewing Gutkha, Smoking and Drinking Alcohol is not allowed while working on Site.\n* Child Labour is not allowed.\n* All the work will be done as per given drawing.\n* As per drawing, If any misconduct is observed the contractor shall be penalized.\n* All The Machines and Tools should be Ready with Safety Before Reaching on site.\n* After completion of installation debries cleaning is mandatory.', '', 8304422.00, 747397.98, 747397.98, 9799217.96, 'Draft', '2025-10-22 11:29:31', '2025-10-22 11:29:31', 'ior9898459568', '0000-00-00', NULL),
(95, 'ME-0000017', 'raju ramesh pise', '2025-12-17', '2025-06-30', 'Due end of the month', 'm', 'Thanks for your business.', '* Advance Payment 20%\n* 80% payment will be done after 15 Days WCC Report.\n* Payment will be done as per work order.\n* Payment will be done as per measurement of Installation of Panel in Sq.Mtr.\n* Ensure minimum wastage of Materials.\n* The quality requirement of the work shall be qualified.\n* All the work will be carried out with safety equipment.\n* Wearing PPT Kit is compalsatory while working on site.\n* Chewing Gutkha, Smoking and Drinking Alcohol is not allowed while working on Site.\n* Child Labour is not allowed.\n* All the work will be done as per given drawing.\n* As per drawing, If any misconduct is observed the contractor shall be penalized.\n* All The Machines and Tools should be Ready with Safety Before Reaching on site.\n* After completion of installation debries cleaning is mandatory.', '', 616000.00, 55440.00, 55440.00, 726880.00, 'Draft', '2025-10-22 11:34:49', '2025-10-22 11:34:49', 'o87yuy', '0000-00-00', NULL),
(96, 'ME-000001934', 'kasturi', '2025-06-20', '2025-06-30', 'Net 30', 'kwejfwe', 'Thanks for your business.', '* Advance Payment 20%\n* 80% payment will be done after 15 Days WCC Report.\n* Payment will be done as per work order.\n* Payment will be done as per measurement of Installation of Panel in Sq.Mtr.\n* Ensure minimum wastage of Materials.\n* The quality requirement of the work shall be qualified.\n* All the work will be carried out with safety equipment.\n* Wearing PPT Kit is compalsatory while working on site.\n* Chewing Gutkha, Smoking and Drinking Alcohol is not allowed while working on Site.\n* Child Labour is not allowed.\n* All the work will be done as per given drawing.\n* As per drawing, If any misconduct is observed the contractor shall be penalized.\n* All The Machines and Tools should be Ready with Safety Before Reaching on site.\n* After completion of installation debries cleaning is mandatory.', '', 36850.00, 3316.50, 3316.50, 43483.00, 'Draft', '2025-10-31 07:36:23', '2025-10-31 07:36:23', 'dkfojfoir3403049', '0000-00-00', NULL),
(97, 'ME-00000174', 'kasturi', '2025-06-21', '2025-06-30', 'Net 30', 'kejfbw', 'Thanks for your business.', '* Advance Payment 20%\n* 80% payment will be done after 15 Days WCC Report.\n* Payment will be done as per work order.\n* Payment will be done as per measurement of Installation of Panel in Sq.Mtr.\n* Ensure minimum wastage of Materials.\n* The quality requirement of the work shall be qualified.\n* All the work will be carried out with safety equipment.\n* Wearing PPT Kit is compalsatory while working on site.\n* Chewing Gutkha, Smoking and Drinking Alcohol is not allowed while working on Site.\n* Child Labour is not allowed.\n* All the work will be done as per given drawing.\n* As per drawing, If any misconduct is observed the contractor shall be penalized.\n* All The Machines and Tools should be Ready with Safety Before Reaching on site.\n* After completion of installation debries cleaning is mandatory.', '', 630934.00, 56784.06, 56784.06, 744502.12, 'Draft', '2025-10-31 07:43:27', '2025-10-31 07:43:27', 'jsdhfiuef38w', '0000-00-00', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `work_order_items`
--

CREATE TABLE `work_order_items` (
  `item_id` int(11) NOT NULL,
  `work_order_id` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `item_detail` varchar(255) DEFAULT NULL,
  `quantity` decimal(10,2) NOT NULL DEFAULT 0.00,
  `rate` decimal(10,2) NOT NULL DEFAULT 0.00,
  `discount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `uom_amount` decimal(10,2) DEFAULT 0.00,
  `uom_description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `work_order_items`
--

INSERT INTO `work_order_items` (`item_id`, `work_order_id`, `product_id`, `item_detail`, `quantity`, `rate`, `discount`, `amount`, `uom_amount`, `uom_description`) VALUES
(1, 81, NULL, 'Sample Product 1', 10.00, 100.00, 0.00, 1000.00, 0.00, NULL),
(2, 81, NULL, 'Sample Product 2', 5.00, 200.00, 0.00, 1000.00, 0.00, NULL),
(3, 83, NULL, '5', 98.00, 839.00, 0.00, 82222.00, 0.00, NULL),
(4, 83, NULL, '7', 76.00, 839.00, 0.00, 63764.00, 0.00, NULL),
(5, 84, NULL, 'fdfgdf', 678.00, 839.00, 0.00, 568842.00, 0.00, NULL),
(6, 84, NULL, 'jkh', 67.00, 780.00, 0.00, 52260.00, 0.00, NULL),
(7, 85, NULL, 'werer', 875.00, 839.00, 0.00, 734125.00, 0.00, NULL),
(8, 86, NULL, 'jkh', 875.00, 780.00, 0.00, 682500.00, 0.00, NULL),
(9, 88, NULL, 'fdfgdf', 87686.00, 839.00, 0.00, 73568554.00, 0.00, NULL),
(10, 89, NULL, 'fdfgdf', 5.00, 0.00, 0.00, 0.00, 0.00, NULL),
(11, 90, NULL, 'jkh', 87487.00, 780.00, 0.00, 68239860.00, 0.00, NULL),
(12, 91, NULL, 'werer', 674.00, 839.00, 0.00, 565486.00, 0.00, NULL),
(13, 92, NULL, 'jkh', 7.00, 780.00, 0.00, 5460.00, 0.00, 'cm'),
(14, 93, NULL, 'jkh', 985.00, 780.00, 0.00, 768300.00, 0.00, 'cm'),
(15, 94, NULL, 'watch', 9898.00, 839.00, 0.00, 8304422.00, 0.00, 'mm'),
(16, 95, NULL, 'final', 88.00, 7000.00, 0.00, 616000.00, 0.00, 'cm'),
(17, 96, NULL, 'payal', 55.00, 670.00, 0.00, 36850.00, 0.00, 'cm'),
(18, 97, NULL, 'payal', 834.00, 670.00, 0.00, 558780.00, 0.00, 'cm'),
(19, 97, NULL, 'lime ', 86.00, 839.00, 0.00, 72154.00, 0.00, '');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `counters`
--
ALTER TABLE `counters`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `financial_years`
--
ALTER TABLE `financial_years`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `invoice`
--
ALTER TABLE `invoice`
  ADD PRIMARY KEY (`invoice_id`),
  ADD KEY `idx_invoice_financial_year` (`financial_year_id`);

--
-- Indexes for table `payment_entries`
--
ALTER TABLE `payment_entries`
  ADD PRIMARY KEY (`payment_id`),
  ADD KEY `idx_invoice_id` (`invoice_id`),
  ADD KEY `idx_payment_entries_financial_year` (`financial_year_id`);

--
-- Indexes for table `products_services`
--
ALTER TABLE `products_services`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `product_units`
--
ALTER TABLE `product_units`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unit_name` (`unit_name`);

--
-- Indexes for table `purchase_orders`
--
ALTER TABLE `purchase_orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `vendor_id` (`vendor_id`),
  ADD KEY `idx_purchase_orders_financial_year` (`financial_year_id`);

--
-- Indexes for table `purchase_order_items`
--
ALTER TABLE `purchase_order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `purchase_order_id` (`purchase_order_id`);

--
-- Indexes for table `quotation`
--
ALTER TABLE `quotation`
  ADD PRIMARY KEY (`quotation_id`),
  ADD KEY `idx_quotation_financial_year` (`financial_year_id`);

--
-- Indexes for table `quotation_items`
--
ALTER TABLE `quotation_items`
  ADD PRIMARY KEY (`item_id`),
  ADD KEY `quotation_id` (`quotation_id`);

--
-- Indexes for table `taxes`
--
ALTER TABLE `taxes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `uom_types`
--
ALTER TABLE `uom_types`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `vendors`
--
ALTER TABLE `vendors`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `work_orders`
--
ALTER TABLE `work_orders`
  ADD PRIMARY KEY (`work_order_id`),
  ADD UNIQUE KEY `work_order_number` (`work_order_number`),
  ADD KEY `idx_work_orders_financial_year` (`financial_year_id`);

--
-- Indexes for table `work_order_items`
--
ALTER TABLE `work_order_items`
  ADD PRIMARY KEY (`item_id`),
  ADD KEY `work_order_id` (`work_order_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `financial_years`
--
ALTER TABLE `financial_years`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `invoice`
--
ALTER TABLE `invoice`
  MODIFY `invoice_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `payment_entries`
--
ALTER TABLE `payment_entries`
  MODIFY `payment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `products_services`
--
ALTER TABLE `products_services`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `product_units`
--
ALTER TABLE `product_units`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `purchase_orders`
--
ALTER TABLE `purchase_orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=65;

--
-- AUTO_INCREMENT for table `purchase_order_items`
--
ALTER TABLE `purchase_order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=62;

--
-- AUTO_INCREMENT for table `quotation`
--
ALTER TABLE `quotation`
  MODIFY `quotation_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `quotation_items`
--
ALTER TABLE `quotation_items`
  MODIFY `item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `taxes`
--
ALTER TABLE `taxes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `uom_types`
--
ALTER TABLE `uom_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `vendors`
--
ALTER TABLE `vendors`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `work_orders`
--
ALTER TABLE `work_orders`
  MODIFY `work_order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=98;

--
-- AUTO_INCREMENT for table `work_order_items`
--
ALTER TABLE `work_order_items`
  MODIFY `item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `invoice`
--
ALTER TABLE `invoice`
  ADD CONSTRAINT `invoice_ibfk_1` FOREIGN KEY (`financial_year_id`) REFERENCES `financial_years` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `payment_entries`
--
ALTER TABLE `payment_entries`
  ADD CONSTRAINT `payment_entries_ibfk_1` FOREIGN KEY (`invoice_id`) REFERENCES `invoice` (`invoice_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `payment_entries_ibfk_2` FOREIGN KEY (`financial_year_id`) REFERENCES `financial_years` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `purchase_orders`
--
ALTER TABLE `purchase_orders`
  ADD CONSTRAINT `purchase_orders_ibfk_1` FOREIGN KEY (`vendor_id`) REFERENCES `vendors` (`id`),
  ADD CONSTRAINT `purchase_orders_ibfk_2` FOREIGN KEY (`financial_year_id`) REFERENCES `financial_years` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `purchase_order_items`
--
ALTER TABLE `purchase_order_items`
  ADD CONSTRAINT `purchase_order_items_ibfk_1` FOREIGN KEY (`purchase_order_id`) REFERENCES `purchase_orders` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `quotation`
--
ALTER TABLE `quotation`
  ADD CONSTRAINT `quotation_ibfk_1` FOREIGN KEY (`financial_year_id`) REFERENCES `financial_years` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `quotation_items`
--
ALTER TABLE `quotation_items`
  ADD CONSTRAINT `quotation_items_ibfk_1` FOREIGN KEY (`quotation_id`) REFERENCES `quotation` (`quotation_id`) ON DELETE CASCADE;

--
-- Constraints for table `work_orders`
--
ALTER TABLE `work_orders`
  ADD CONSTRAINT `work_orders_ibfk_1` FOREIGN KEY (`financial_year_id`) REFERENCES `financial_years` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `work_order_items`
--
ALTER TABLE `work_order_items`
  ADD CONSTRAINT `work_order_items_ibfk_1` FOREIGN KEY (`work_order_id`) REFERENCES `work_orders` (`work_order_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
