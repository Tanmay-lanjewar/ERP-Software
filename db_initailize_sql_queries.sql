CREATE DATABASE IF NOT EXISTS erp_db;
USE erp_db;


-- //financial_years
CREATE TABLE IF NOT EXISTS financial_years (
  id INT(11) NOT NULL AUTO_INCREMENT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_active TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);


-- product_services
CREATE TABLE IF NOT EXISTS product_services (
  id INT(11) NOT NULL AUTO_INCREMENT,
  type ENUM('Product', 'Service') NOT NULL,
  product_name VARCHAR(100) NOT NULL,
  sku VARCHAR(50),
  tax_applicable VARCHAR(100),
  status ENUM('Active', 'Inactive') DEFAULT 'Active',
  category VARCHAR(100),
  unit VARCHAR(50),
  sale_price DECIMAL(10,2),
  sale_discount DECIMAL(5,2),
  sale_discount_type ENUM('%', 'Flat') DEFAULT '%',
  sale_description TEXT,
  purchase_price DECIMAL(10,2),
  purchase_discount DECIMAL(5,2),
  purchase_discount_type ENUM('%', 'Flat') DEFAULT '%',
  purchase_description TEXT,
  preferred_vendor VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

-- Taxes
CREATE TABLE IF NOT EXISTS taxes (
  id INT(11) NOT NULL AUTO_INCREMENT,
  tax_name VARCHAR(100),
  tax_rate DECIMAL(5,2),
  tax_code VARCHAR(50),
  details TEXT,
  status ENUM('Active', 'Inactive') DEFAULT 'Active',
  effective_date DATE,
  PRIMARY KEY (id)
);
