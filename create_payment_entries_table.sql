-- Create payment_entries table
CREATE TABLE `payment_entries` (
  `payment_id` int(11) NOT NULL AUTO_INCREMENT,
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
  PRIMARY KEY (`payment_id`),
  KEY `idx_invoice_id` (`invoice_id`),
  FOREIGN KEY (`invoice_id`) REFERENCES `invoice`(`invoice_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;