USE erp_db;

-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'superadmin') NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert test credentials (password is 'password123' for both users)
-- Password hash generated using bcrypt with salt round 10
INSERT INTO users (username, password, role) VALUES
('admin@erp.com', '$2b$10$PaV2SKJ1.tYFz1QRkUkzseGwvUCNDwGXNzUOHXVx5kY.h.gjXVqRi', 'admin'),
('superadmin@erp.com', '$2b$10$PaV2SKJ1.tYFz1QRkUkzseGwvUCNDwGXNzUOHXVx5kY.h.gjXVqRi', 'superadmin');