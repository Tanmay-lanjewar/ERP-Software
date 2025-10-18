-- Create product_units table
CREATE TABLE IF NOT EXISTS `product_units` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `unit_name` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unit_name` (`unit_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Insert some default units
INSERT INTO `product_units` (`unit_name`) VALUES 
('cm'),
('mm'),
('kg'),
('pcs'),
('liters'),
('gm'),
('box'),
('dozen');