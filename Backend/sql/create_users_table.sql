USE erp_db;

-- Create users table with role support
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'superadmin') NOT NULL DEFAULT 'admin',
  status ENUM('Active', 'Inactive') DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin and superadmin users
-- Default password is 'admin123' for both users (you should change these in production)
INSERT INTO users (username, password, role) VALUES 
('admin', '$2b$10$PaV2SKJ1.tYFz1QRkUkzseGwvUCNDwGXNzUOHXVx5kY.h.gjXVqRi', 'admin'),
('superadmin', '$2b$10$PaV2SKJ1.tYFz1QRkUkzseGwvUCNDwGXNzUOHXVx5kY.h.gjXVqRi', 'superadmin');