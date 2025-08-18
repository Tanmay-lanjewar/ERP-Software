-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 14, 2025 at 12:19 PM
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
  `billing_pincode` varchar(10) DEFAULT NULL,
  `billing_fax` varchar(20) DEFAULT NULL,
  `billing_phone` varchar(20) DEFAULT NULL,
  `shipping_recipient_name` varchar(100) DEFAULT NULL,
  `shipping_country` varchar(50) DEFAULT NULL,
  `shipping_address1` text DEFAULT NULL,
  `shipping_address2` text DEFAULT NULL,
  `shipping_city` varchar(50) DEFAULT NULL,
  `shipping_state` varchar(50) DEFAULT NULL,
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

INSERT INTO `customers` (`id`, `customer_type`, `title`, `customer_name`, `company_name`, `display_name`, `email`, `mobile`, `office_no`, `pan`, `gst`, `currency`, `document_path`, `billing_recipient_name`, `billing_country`, `billing_address1`, `billing_address2`, `billing_city`, `billing_state`, `billing_pincode`, `billing_fax`, `billing_phone`, `shipping_recipient_name`, `shipping_country`, `shipping_address1`, `shipping_address2`, `shipping_city`, `shipping_state`, `shipping_pincode`, `shipping_fax`, `shipping_phone`, `remark`, `created_at`, `status`) VALUES
(1, 'Domestic', 'MR', 'John Doe', 'Doe Industries', 'John D.', 'john.doe@example.com', '9876543210', '02212345678', 'ABCDE1234F', '27ABCDE1234F1Z5', 'INR', '/path/to/document.pdf', 'Jane Doe', 'India', '123 Billing Street', 'Suite 456', 'Mumbai', 'Maharashtra', '400001', '02298765432', '02212349876', 'Jake Doe', 'India', '789 Shipping Lane', 'Floor 2', 'Pune', 'Maharashtra', '411008', '02076543210', '02012345670', 'Test remark entry', '2025-07-16 16:19:39', 'Active'),
(2, 'International', 'MS', 'Alice Smith', 'Smith Global Ltd', 'A. Smith', 'alice.smith@example.com', '1234567890', '01123456789', 'ABCDE5678G', '29ABCDE5678G1Z9', 'USD', '/docs/alice_contract.pdf', 'Bob Smith', 'USA', '456 Elm Street', 'Apt 12', 'New York', 'NY', '10001', '001123456789', '001987654321', 'Carol Smith', 'USA', '789 Oak Avenue', 'Suite 300', 'Los Angeles', 'CA', '90001', '001654321098', '001321654987', 'First international customer', '2025-07-16 16:25:00', 'Inactive'),
(3, 'Domestic', 'DR', 'Dr. Rahul Mehra', 'Mehra Health Pvt Ltd', 'Dr. Mehra', 'rahul.mehra@health.com', '9988776655', '08022334455', 'AABCD2345H', '33AABCD2345H1Z2', 'INR', '/docs/rahul_profile.pdf', 'Sonal Mehra', 'India', '789 Health Road', 'Block B', 'Bangalore', 'Karnataka', '560001', '08033445566', '08044556677', 'Ravi Mehra', 'India', '123 Care Avenue', 'Wing C', 'Hyderabad', 'Telangana', '500001', '04055667788', '04066778899', 'Priority healthcare customer', '2025-07-16 16:25:39', 'Inactive'),
(4, 'International', 'MRS', 'Emily Johnson', 'Johnson Exports', 'E. Johnson', 'emily.johnson@exports.com', '8765432109', '02033445566', 'AACDE6789J', '07AACDE6789J1Z7', 'EUR', '/docs/emily_invoice.pdf', 'Michael Johnson', 'Germany', '321 Export Boulevard', 'Building 9', 'Berlin', 'Berlin', '10115', '0049123456789', '0049987654321', 'Sara Johnson', 'Germany', '654 Import Street', 'Unit 5', 'Hamburg', 'Hamburg', '20095', '0049765432109', '0049876543210', 'Important EU customer', '2025-07-16 16:26:04', 'Inactive'),
(5, 'Domestic', 'MR', 'anshu ', 'pie', 'dfgdf', 'dfg', 'fgd', 'fdgd', 'fgdf', 'fdfg', 'INR', 'fgdgdf', 'dfgdfgf', 'dfgfgfggfgfgfgffgdfgfd', '', 'gdfdfgdfgdfgfgfgdf', 'fgdfgdfdfgfgdfdf', 'fgfdgdfgfdgfdgfgfdg', 'fgdfgdfdfg', 'fgdfgdfgdfgfgf', 'fgdfgffgdfgfddfg', 'dfgfgfggffgdfgdf', 'India', 'fgdfgffgdfgdf', 'LIC OFFICE ROAD', 'Wardha', 'Maharashtra', '442001', '', '07588674622', '', '2025-07-23 16:12:52', 'Active'),
(6, 'Domestic', 'MR', 'arjun g', 'Code Commandos', '', 'ag238275@gmail.com', '07498537342', '1234567891', 'hgh', '12234567890', 'INR', '', 'Arjun Gupta', 'India', 'wardha', 'Home', 'wardha', 'Maharashtra', '442001', '45363738', '07498537342', 'sai', 'India', 'wardha', 'Home', 'wardha', 'Maharashtra', '442001', '768833', '07498537342', 'done', '2025-07-23 17:57:13', 'Inactive'),
(7, 'Domestic', 'MR', 'Prajwal', 'Tech', 'Techtic', 'ag238275@gmail.com', '07498537342', '1234567891', '123456789', '657890', 'INR', 'fg', '', 'India', 'Sai Mandhir Road Wardha', 'Home', 'wardha', 'Maharashtra', '442001', '45363738', '', 'sai', 'India', 'wardha', 'Home', 'wardha', 'Maharashtra', '442001', '123456', '07498537342', 'done', '2025-07-24 07:32:46', 'Active'),
(8, 'Domestic', 'MR', 'Arjun Gupta', 'Code Commandos', 'Techtic', 'ag238275@gmail.com', '07498537342', '1234567891', 'hgh', '12234567890', 'INR', 'fg', '', 'India', 'wardha', 'Home', 'wardha', 'Maharashtra', '442001', '45363738', '', 'sai', 'India', 'wardha', 'Home', 'wardha', 'Maharashtra', '442001', '777', '07498537342', 'done', '2025-07-24 09:48:34', 'Active'),
(9, 'Domestic', 'MR', 'arjun g', 'Code Commandos', 'Techtic', 'ag238275@gmail.com', '07498537342', '1234567891', '123456789', '1234567890', 'INR', 'th', 'Arjun Gupta', 'India', 'Sai Mandhir Road Wardha', 'Home', 'wardha', 'Maharashtra', '442001', '1234567890', '1234567890', 'sai', 'India', 'Sai Mandhir Road Wardha', 'Home', 'wardha', 'Maharashtra', '442001', '1234556', '07498537342', 'ok', '2025-08-11 18:40:42', 'Active');

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
(4, '2025-07-18', '2026-07-17', 1, '2025-07-23 17:54:39');

-- --------------------------------------------------------

--
-- Table structure for table `invoice`
--

CREATE TABLE `invoice` (
  `invoice_id` int(11) NOT NULL,
  `invoice_number` varchar(20) DEFAULT NULL,
  `customer_name` varchar(255) NOT NULL,
  `invoice_date` date NOT NULL,
  `expiry_date` date NOT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `customer_notes` text DEFAULT NULL,
  `terms_and_conditions` text DEFAULT NULL,
  `sub_total` double DEFAULT NULL,
  `cgst` double DEFAULT NULL,
  `sgst` double DEFAULT NULL,
  `grand_total` double DEFAULT NULL,
  `status` enum('Draft','Partial','Paid') DEFAULT 'Draft',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `invoice`
--

INSERT INTO `invoice` (`invoice_id`, `invoice_number`, `customer_name`, `invoice_date`, `expiry_date`, `subject`, `customer_notes`, `terms_and_conditions`, `sub_total`, `cgst`, `sgst`, `grand_total`, `status`, `created_at`) VALUES
(1, 'INV-000001', 'Arjun', '2024-05-30', '2024-06-08', 'Test Invoice', 'Thank you', 'Pay within 10 days', 390, 35.1, 35.1, 460.2, 'Draft', '2025-07-25 11:01:40'),
(2, 'INV-000002', 'Arjun Kumar', '2024-06-10', '2024-06-20', 'Website Development', 'Thank you for your business.', 'Payment due within 10 days.', 17000, 1530, 1530, 20060, 'Draft', '2025-07-25 11:02:32'),
(3, 'INV-000003', 'John Doe', '2025-07-23', '2025-07-22', 'nn', 'thanks', 'jj', 55, 4.95, 4.95, 64.9, 'Draft', '2025-07-25 11:10:41'),
(4, 'INV-000004', 'John Doe', '2025-07-26', '2025-07-22', 'hhh', 'trank', '', 2000, 180, 180, 2360, 'Partial', '2025-07-25 11:13:55'),
(5, 'INV-000005', 'John Doe', '2025-07-30', '2025-07-29', 'ko', 'ok', '', 261, 23.49, 23.49, 307.98, 'Paid', '2025-07-25 14:38:55'),
(6, 'INV-000006', 'John Doe', '2025-07-30', '2025-07-29', '777', 'hh', 'jj', 126, 11.34, 11.34, 148.68, 'Partial', '2025-07-27 20:51:14'),
(7, 'INV-000007', 'John Doe', '0000-00-00', '0000-00-00', 'ok', 'ok', '', 19, 1.71, 1.71, 22.42, 'Draft', '2025-08-11 18:42:31');

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
  `amount` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `invoice_items`
--

INSERT INTO `invoice_items` (`item_id`, `invoice_id`, `item_detail`, `quantity`, `rate`, `discount`, `amount`) VALUES
(1, 1, 'Product 1', 2, 100, 0, 200),
(2, 1, 'Product 2', 1, 200, 10, 190),
(3, 2, 'Website Design', 1, 15000, 0, 15000),
(4, 2, 'Hosting (1 year)', 1, 2000, 0, 2000),
(5, 3, '', 2, 30, 5, 55),
(6, 4, 'ar', 10, 200, 0, 2000),
(7, 5, 'soap', 14, 19, 5, 261),
(8, 6, '77', 9, 14, 0, 126),
(9, 7, 'Mini', 4, 6, 5, 19);

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
(1, 'Service', 'Anush', 'JKH78744', '2', 'Active', 'main', 'cm', 780.00, 10.00, '%', 'khk', 78.00, 2.00, '%', 'jhhjkj', 'Laxmi Motors', '2025-07-16 16:31:18'),
(2, 'Product', 'jkh', 'JKH44428', '2', 'Inactive', 'jkjh', 'cm', 0.00, 10.00, '%', '', 78.00, 2.00, '%', '', '', '2025-07-16 16:32:24'),
(3, 'Product', 'jhgjhgjgjhgjhgjhghj', 'JHG85565', '', 'Inactive', '', 'cm', 0.00, 0.00, '%', '', 0.00, 0.00, '%', '', '', '2025-07-16 16:33:05'),
(4, 'Product', 'werer', 'WER97809', '3', 'Active', 'hkkhkj', '', 839.00, 10.00, '%', 'jdfjd', 7.00, 9.00, '%', '', '', '2025-07-23 16:16:37'),
(5, 'Product', 'Nirma', 'NIR71771', '2', 'Active', 'infra', '', 300.00, 50.00, '%', 'done', 400.00, 30.00, '%', 'h', '', '2025-07-23 17:56:11'),
(6, 'Product', 'gharsoap', 'GHA40101', '2', 'Active', 'match', '', 400.00, 5.00, '%', 'soap', 300.00, 5.00, '%', 'ok', 'ABC Traders', '2025-07-28 17:09:00'),
(7, 'Product', 'Shampoo', 'SHA94521', '2', 'Active', 'match', 'kg', 500.00, 30.00, '%', 'Shamppo sel', 300.00, 30.00, '%', 'Sell', 'ABC Traders', '2025-08-11 18:39:54'),
(8, 'Product', 'Handwash', 'HAN08270', '2', 'Active', 'match', 'mm', 300.00, 20.00, '%', 'ok', 600.00, 20.00, '%', 'ok', 'Anush', '2025-08-14 10:11:48');

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
  `cgst` decimal(10,2) DEFAULT NULL,
  `sgst` decimal(10,2) DEFAULT NULL,
  `total` decimal(10,2) DEFAULT NULL,
  `attachment` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `purchase_orders`
--

INSERT INTO `purchase_orders` (`id`, `purchase_order_no`, `delivery_to`, `delivery_address`, `vendor_name`, `purchase_order_date`, `delivery_date`, `payment_terms`, `due_date`, `customer_notes`, `terms_and_conditions`, `sub_total`, `cgst`, `sgst`, `total`, `attachment`, `created_at`) VALUES
(1, 'PO-1001', 'organization', '123 Street, City', 'Arjun Traders', '2025-07-26', '2025-07-30', 'Net 15', '2025-08-10', 'Handle with care', 'Standard terms apply', 1000.00, 90.00, 90.00, 1180.00, 'invoice.pdf', '2025-07-26 13:14:23'),
(2, 'PO-1002', '', '456 Industrial Area, Pune', 'Sharma Suppliers', '2025-07-28', '2025-08-02', 'Net 30', '2025-08-28', 'Deliver during working hours only', 'Payment after delivery inspection', 2500.00, 225.00, 225.00, 2950.00, 'sharma_invoice.pdf', '2025-07-26 15:52:52'),
(3, 'PO-0001', 'organization', 'Laxmi Enterprises,\nNagpur, Maharashtra, 200145', '', '0000-00-00', '0000-00-00', '', '0000-00-00', '', '', 49.00, 4.41, 4.41, 57.82, '', '2025-07-28 07:02:40'),
(4, 'PO-0001', 'organization', 'Laxmi Enterprises,\nNagpur, Maharashtra, 200145', 'Arjun Enterprises', '0000-00-00', '0000-00-00', '', '0000-00-00', '', '', 43.00, 3.87, 3.87, 50.74, '', '2025-07-28 07:04:13'),
(5, 'PO-0001', 'organization', 'Laxmi Enterprises,\nNagpur, Maharashtra, 200145', 'Prajwal', '0000-00-00', '0000-00-00', '', '0000-00-00', '', '', 125.00, 11.25, 11.25, 147.50, '', '2025-07-28 07:04:49'),
(6, 'PO-0002', 'organization', 'Laxmi Enterprises,\nNagpur, Maharashtra, 200145', 'Arjun Enterprises', '2025-07-22', '2025-07-30', 'Net 15', '2025-07-29', 'thanku', 'ok', 205.00, 18.45, 18.45, 241.90, '', '2025-07-28 07:08:45'),
(7, 'PO-0003', 'organization', 'Laxmi Enterprises,\nNagpur, Maharashtra, 200145', 'Prajwal', '2025-07-30', '2025-07-30', 'Net 15', '2025-07-29', 'Done', 'done', 145.00, 13.05, 13.05, 171.10, '', '2025-07-28 07:29:25'),
(8, '6', 'organization', 'Laxmi Enterprises,\nNagpur, Maharashtra, 200145', 'Prajwal', '2025-07-22', '2025-07-30', 'Net 30', '2025-07-30', 'thanks', 'k', 176.00, 15.84, 15.84, 207.68, '', '2025-07-28 16:58:04'),
(9, 'PO-0001', 'organization', 'Laxmi Enterprises,\nNagpur, Maharashtra, 200145', 'Prajwal', '2025-08-14', '2025-08-20', 'Net 15', '2025-08-21', 'n', '', 73.00, 6.57, 6.57, 86.14, '', '2025-08-11 18:43:17'),
(10, 'PO-0006', 'organization', 'Laxmi Enterprises,\nNagpur, Maharashtra, 200145', 'Anush', '2025-08-26', '2025-08-15', 'Net 15', '2025-08-26', 'ok', 'ok', 19.00, 1.71, 1.71, 22.42, '', '2025-08-14 10:05:29');

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
  `amount` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `purchase_order_items`
--

INSERT INTO `purchase_order_items` (`id`, `purchase_order_id`, `item_name`, `qty`, `rate`, `discount`, `amount`) VALUES
(1, 1, 'Item 1', 2, 200.00, 10.00, 380.00),
(2, 1, 'Item 2', 3, 200.00, 20.00, 540.00),
(3, 2, 'Steel Rod', 10, 150.00, 0.00, 1500.00),
(4, 2, 'Cement Bag', 5, 200.00, 10.00, 950.00),
(5, 3, 'soap', 3, 18.00, 5.00, 49.00),
(6, 4, 'gharsoap', 12, 4.00, 5.00, 43.00),
(7, 5, 'gharsoap', 13, 10.00, 5.00, 125.00),
(8, 6, 'L', 10, 21.00, 5.00, 205.00),
(9, 7, 'gharsoap', 10, 15.00, 5.00, 145.00),
(10, 8, 'gharsoap', 11, 16.00, 0.00, 176.00),
(11, 9, 'prodt', 13, 6.00, 5.00, 73.00),
(12, 10, 'ABCDE1234F', 6, 4.00, 5.00, 19.00);

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
  `cgst` double DEFAULT NULL,
  `sgst` double DEFAULT NULL,
  `grand_total` double DEFAULT NULL,
  `attachment_url` varchar(500) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('Draft','Sent') DEFAULT 'Draft',
  `quote_number` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `quotation`
--

INSERT INTO `quotation` (`quotation_id`, `customer_name`, `quotation_date`, `expiry_date`, `subject`, `customer_notes`, `terms_and_conditions`, `sub_total`, `cgst`, `sgst`, `grand_total`, `attachment_url`, `created_at`, `status`, `quote_number`) VALUES
(4, 'Customer A', '2025-08-19', '2025-09-19', 'Developer', 'Thanks for your business.', 'ye', 50, 4.5, 4.5, 59, NULL, '2025-07-25 06:28:15', 'Sent', NULL),
(5, 'Arjun Gupta', '2025-08-21', '2025-09-21', 'Karan', 'Thanks for your business.', '', 1995, 179.55, 179.55, 2354.1, NULL, '2025-07-25 09:15:05', 'Sent', NULL),
(6, 'anshu ', '2025-08-21', '2025-09-21', 'marketig', 'Thanks for your business.', '', 331, 29.79, 29.79, 390.58, NULL, '2025-07-25 09:17:03', 'Draft', NULL),
(7, 'John Doe', '2025-08-21', '2025-09-21', 'marketup', 'Thanks for your business.', '', 112, 10.08, 10.08, 132.16, NULL, '2025-07-25 09:18:39', 'Draft', NULL),
(8, 'John Doe', '2025-08-21', '2025-09-21', 'jj', 'Thanks for your business.', '', 7, 0.63, 0.63, 8.26, NULL, '2025-07-25 09:25:33', 'Sent', 'QT-000008'),
(9, 'Alice Smith', '2025-08-21', '2025-09-21', 'karan', 'Thanks for your business.', '', 70, 6.3, 6.3, 82.6, NULL, '2025-07-25 09:27:39', 'Sent', 'QT-000009'),
(10, 'Alice Smith', '2025-08-21', '2025-09-21', 'arjun', 'Thanks for your business.', '', 105, 9.45, 9.45, 123.9, NULL, '2025-07-25 09:52:22', 'Sent', 'QT-000010'),
(11, 'John Doe', '2025-08-21', '2025-09-21', 'rt', 'Thanks for your business.', '', 711, 63.99, 63.99, 838.98, NULL, '2025-07-25 12:12:04', 'Sent', 'QT-000011'),
(12, 'John Doe', '2025-08-21', '2025-09-21', 'au', 'Thanks for your business.', '', 61, 5.49, 5.49, 71.98, NULL, '2025-08-11 18:41:43', 'Sent', 'QT-000012');

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
  `amount` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `quotation_items`
--

INSERT INTO `quotation_items` (`item_id`, `quotation_id`, `item_detail`, `quantity`, `rate`, `discount`, `amount`) VALUES
(4, 4, 'soap', 5, 11, 5, 50),
(5, 5, 'monk', 5, 400, 5, 1995),
(6, 6, 'tech', 8, 42, 5, 331),
(7, 7, 'shampoo', 13, 9, 5, 112),
(8, 8, 'A little, just starting', 4, 3, 5, 7),
(9, 9, '22', 5, 14, 0, 70),
(10, 10, 'ruo', 10, 11, 5, 105),
(11, 11, 'jjj', 9, 79, 0, 711),
(12, 12, 'Demel', 6, 11, 5, 61);

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
(1, 'gst 20', 19.00, 'jlkj', 'Effective from 2025-07-16', 'Inactive', '2025-07-14'),
(2, 'cGST', 10.00, 'thtrh', 'Effective from 2025-07-16', 'Active', '2025-07-16'),
(3, 'GST', 20.00, 'tech', 'Effective from 2025-07-23', 'Active', '2025-07-23'),
(4, 'GST', 8.00, '8', 'Effective from 2025-08-11', 'Active', '2025-08-11');

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
  `status` enum('Active','Inactive') DEFAULT 'Active',
  `address` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `vendors`
--

INSERT INTO `vendors` (`id`, `vendor_name`, `company_name`, `display_name`, `email`, `phone`, `pan`, `gst`, `billing_recipient_name`, `billing_country`, `billing_address1`, `billing_address2`, `billing_city`, `billing_state`, `billing_pincode`, `billing_fax`, `billing_phone`, `shipping_recipient_name`, `shipping_country`, `shipping_address1`, `shipping_address2`, `shipping_city`, `shipping_state`, `shipping_pincode`, `shipping_fax`, `shipping_phone`, `account_holder_name`, `bank_name`, `account_number`, `ifsc`, `remark`, `status`, `address`) VALUES
(1, 'Arjun', 'Arju', 'Arjun', 'arjun@example.com', '9876543210', 'ABCDE1234F', '27ABCDE1234F1Z5', 'Arjun Gupta', 'India', '123 Main Road', 'Near City Mall', 'Nagpur', 'Maharashtra', '440001', '0712-123456', '9876543211', 'Arjun Gupta', 'India', '456 Shipping Street', 'Opposite Market', 'Wardha', 'Maharashtra', '442001', '07152-234567', '9876543212', 'Arjun', 'HDFC Bank', '123456789012', 'HDFC0001234', 'First vendor added', 'Active', NULL),
(2, 'Prajwal', 'Tech', 'Kaish', 'ag238275@gmail.com', '07498537342', '123456789', '12345678', NULL, '', 'Sai Mandhir Road Wardha', 'Home', 'wardha', 'Maharashtra', '442001', '12345678', NULL, NULL, '', 'wardha', 'Home', 'wardha', 'Maharashtra', '442001', '12345678', NULL, '12345678', '12345678', '12345678', '12345678', '12345678', 'Active', NULL),
(3, 'Arjun Gupta', 'Code Commandos', 'Karan', 'ag238275@gmail.com', '07498537342', '1234567890', '123456789', NULL, '', 'Sai Mandhir Road Wardha', 'Home', 'wardha', 'Maharashtra', '442001', '123456789', NULL, NULL, '', 'Sai Mandhir Road Wardha', 'Home', 'wardha', 'Maharashtra', '442001', '123456789', NULL, 'Arjun Gupta', 'SBI', '1234567890', 'SBIHTNKLK', 'marketup', 'Active', NULL),
(4, 'Arjun Gupta', 'Code Commandos', 'Karan', 'ag238275@gmail.com', '07498537342', '1234567890', '123456789', NULL, '', 'Sai Mandhir Road Wardha', 'Home', 'wardha', 'Maharashtra', '442001', '123456789', NULL, NULL, '', 'Sai Mandhir Road Wardha', 'Home', 'wardha', 'Maharashtra', '442001', '123456789', NULL, 'Arjun Gupta', 'SBI', '1234567890', 'SBIHTNKLK', 'marketup', 'Active', NULL),
(5, 'Anush', 'Tech', 'marketig', 'ag238275@gmail.com', '07498537342', '123456789', '', NULL, 'India', 'Sai Mandhir Road Wardha', 'Home', 'wardha', 'Maharashtra', '442001', 'wardha', NULL, NULL, 'India', 'Sai Mandhir Road Wardha', 'Home', 'wardha', 'Maharashtra', '442001', '123456789', NULL, 'Anush Pise', 'SBI', '7808537342', '1234567890', '1234567890', 'Active', NULL),
(6, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL),
(7, 'John Doe Updated', 'Doe Enterprises Ltd', 'Doe Ent Ltd', 'john.doe.updated@example.com', '9876543211', 'ABCDE1234F', '22AAAAA0000A1Z5', 'John Doe Updated', 'India', '789 New Street', 'Near Mall', 'Delhi', 'Delhi', '110001', '0111234567', '9123456788', 'Jane Doe Updated', 'India', '101 New Road', 'Apt 202', 'Bangalore', 'Karnataka', '560001', '0801234567', '9234567891', 'John Doe Updated', 'ICICI Bank', '987654321098', 'ICIC0001234', 'Updated vendor for electronics', 'Active', NULL),
(8, 'arjun g', 'Code Commandos', 'Aejun', 'ag238275@gmail.com', '07498537342', '1234567890', '1234567890', NULL, 'India', 'Sai Mandhir Road Wardha', 'Home', 'wardha', 'Maharashtra', '442001', '1234566788', NULL, NULL, 'India', 'Sai Mandhir Road Wardha', 'Home', 'wardha', 'Maharashtra', '442001', '12345677', NULL, 'Arjun', 'Sbi', '1234567899', ' bi222', 'ok', 'Active', NULL);

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
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `work_orders`
--

INSERT INTO `work_orders` (`work_order_id`, `work_order_number`, `customer_name`, `work_order_date`, `due_date`, `payment_terms`, `subject`, `customer_notes`, `terms_and_conditions`, `attachment_url`, `sub_total`, `cgst`, `sgst`, `grand_total`, `status`, `created_at`, `updated_at`) VALUES
(1, 'WO-1001', 'Dr. Rahul Mehra', '2025-07-28', '0000-00-00', NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, 0.00, 59000.00, 'Completed', '2025-07-28 17:05:34', '2025-08-12 10:49:29'),
(2, 'WO-1002', 'Bendre\'s Agro Solutions', '2025-07-28', '2025-08-15', '50% advance, 50% on delivery', 'Supply of Organic Fertilizers', 'Deliver in eco-friendly packaging.', 'Payment upon inspection of goods. No returns after 7 days.', 'https://example.com/attachments/wo-1002.pdf', 30000.00, 2700.00, 2700.00, 35400.00, 'Confirmed', '2025-07-28 17:06:32', '2025-07-28 17:06:32'),
(3, 'INV-000001', 'Dr. Rahul Mehra', '2025-06-21', '2025-06-30', 'Net 15', 'hello work done', 'Thanks for your business.', 'ok', '', 10063.00, 905.67, 905.67, 11874.34, 'Draft', '2025-07-28 17:17:27', '2025-07-28 17:17:27'),
(8, 'INV-000003', 'Dr. Rahul Mehra', '2025-06-21', '2025-06-30', 'Net 15', 'ok', 'Thanks for your business.', 'ok', '', 427.00, 38.43, 38.43, 503.86, 'Draft', '2025-08-14 09:06:05', '2025-08-14 09:06:05'),
(9, 'INV-000008', 'Dr. Rahul Mehra', '2025-06-21', '2025-06-30', 'Net 30', 'done', 'Thanks for your business.', 'ok', '', 25.00, 2.25, 2.25, 29.50, 'Draft', '2025-08-14 10:02:11', '2025-08-14 10:02:11');

--
-- Indexes for dumped tables
--

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
  ADD UNIQUE KEY `invoice_number` (`invoice_number`);

--
-- Indexes for table `invoice_items`
--
ALTER TABLE `invoice_items`
  ADD PRIMARY KEY (`item_id`),
  ADD KEY `invoice_id` (`invoice_id`);

--
-- Indexes for table `products_services`
--
ALTER TABLE `products_services`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `purchase_orders`
--
ALTER TABLE `purchase_orders`
  ADD PRIMARY KEY (`id`);

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
  ADD UNIQUE KEY `quote_number` (`quote_number`);

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
-- Indexes for table `vendors`
--
ALTER TABLE `vendors`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `work_orders`
--
ALTER TABLE `work_orders`
  ADD PRIMARY KEY (`work_order_id`),
  ADD UNIQUE KEY `work_order_number` (`work_order_number`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `financial_years`
--
ALTER TABLE `financial_years`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `invoice`
--
ALTER TABLE `invoice`
  MODIFY `invoice_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `invoice_items`
--
ALTER TABLE `invoice_items`
  MODIFY `item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `products_services`
--
ALTER TABLE `products_services`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `purchase_orders`
--
ALTER TABLE `purchase_orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `purchase_order_items`
--
ALTER TABLE `purchase_order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `quotation`
--
ALTER TABLE `quotation`
  MODIFY `quotation_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `quotation_items`
--
ALTER TABLE `quotation_items`
  MODIFY `item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `taxes`
--
ALTER TABLE `taxes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `vendors`
--
ALTER TABLE `vendors`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `work_orders`
--
ALTER TABLE `work_orders`
  MODIFY `work_order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `invoice_items`
--
ALTER TABLE `invoice_items`
  ADD CONSTRAINT `invoice_items_ibfk_1` FOREIGN KEY (`invoice_id`) REFERENCES `invoice` (`invoice_id`) ON DELETE CASCADE;

--
-- Constraints for table `purchase_order_items`
--
ALTER TABLE `purchase_order_items`
  ADD CONSTRAINT `purchase_order_items_ibfk_1` FOREIGN KEY (`purchase_order_id`) REFERENCES `purchase_orders` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `quotation_items`
--
ALTER TABLE `quotation_items`
  ADD CONSTRAINT `quotation_items_ibfk_1` FOREIGN KEY (`quotation_id`) REFERENCES `quotation` (`quotation_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
