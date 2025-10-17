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
CREATE TABLE products_services (
    id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
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
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT
    _TIMESTAMP
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



--costumer:
CREATE DATABASE IF NOT EXISTS erp_db;
USE erp_db;

CREATE TABLE customers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_type ENUM('Domestic', 'International') NOT NULL DEFAULT 'Domestic',
  title ENUM('MR', 'MS', 'MRS', 'DR') DEFAULT 'MR',
  customer_name VARCHAR(100) NOT NULL,
  company_name VARCHAR(100),
  display_name VARCHAR(100),
  email VARCHAR(100),
  mobile VARCHAR(15),
  office_no VARCHAR(15),
  pan VARCHAR(20),
  gst VARCHAR(30),
  currency VARCHAR(10) DEFAULT 'INR',
  document_path VARCHAR(255),

  -- Billing Address
  billing_recipient_name VARCHAR(100),
  billing_country VARCHAR(50),
  billing_address1 TEXT,
  billing_address2 TEXT,
  billing_city VARCHAR(50),
  billing_state VARCHAR(50),
  billing_pincode VARCHAR(10),
  billing_fax VARCHAR(20),
  billing_phone VARCHAR(20),

  -- Shipping Address
  shipping_recipient_name VARCHAR(100),
  shipping_country VARCHAR(50),
  shipping_address1 TEXT,
  shipping_address2 TEXT,
  shipping_city VARCHAR(50),
  shipping_state VARCHAR(50),
  shipping_pincode VARCHAR(10),
  shipping_fax VARCHAR(20),
  shipping_phone VARCHAR(20),

  remark TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE customers
ADD COLUMN status ENUM('Active', 'Inactive') DEFAULT 'Active';


-- vendors:
CREATE TABLE vendors (
  id INT PRIMARY KEY AUTO_INCREMENT,
  vendor_name VARCHAR(255),
  company_name VARCHAR(255),
  display_name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(20),
  pan VARCHAR(20),
  gst VARCHAR(20),

  billing_recipient_name VARCHAR(255),
  billing_country VARCHAR(100),
  billing_address1 TEXT,
  billing_address2 TEXT,
  billing_city VARCHAR(100),
  billing_state VARCHAR(100),
  billing_pincode VARCHAR(20),
  billing_fax VARCHAR(50),
  billing_phone VARCHAR(20),

  shipping_recipient_name VARCHAR(255),
  shipping_country VARCHAR(100),
  shipping_address1 TEXT,
  shipping_address2 TEXT,
  shipping_city VARCHAR(100),
  shipping_state VARCHAR(100),
  shipping_pincode VARCHAR(20),
  shipping_fax VARCHAR(50),
  shipping_phone VARCHAR(20),

  account_holder_name VARCHAR(255),
  bank_name VARCHAR(255),
  account_number VARCHAR(50),
  ifsc VARCHAR(20),
  remark TEXT,
  
  status ENUM('Active', 'Inactive') DEFAULT 'Active'
);

USE erp_db;
   


-- Create table for quotation
CREATE TABLE IF NOT EXISTS quotation (
  quotation_id INT AUTO_INCREMENT PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  quotation_date DATE NOT NULL,
  expiry_date DATE NOT NULL,
  subject VARCHAR(255),
  customer_notes TEXT,
  terms_and_conditions TEXT,
  sub_total DOUBLE,
  cgst DOUBLE,
  sgst DOUBLE,
  attachment_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create table for quotation items
CREATE TABLE IF NOT EXISTS quotation_items (
  item_id INT AUTO_INCREMENT PRIMARY KEY,
  quotation_id INT,
  item_detail VARCHAR(255),
  quantity INT,
  rate DOUBLE,
  discount FLOAT,
  amount FLOAT,
  FOREIGN KEY (quotation_id) REFERENCES quotation(quotation_id) ON DELETE CASCADE
);

-- Create table for work_orders
CREATE TABLE IF NOT EXISTS work_orders (
  work_order_id INT AUTO_INCREMENT PRIMARY KEY,
  work_order_number VARCHAR(255) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  work_order_date DATE NOT NULL,
  due_date DATE,
  payment_terms TEXT,
  subject VARCHAR(255),
  customer_notes TEXT,
  terms_and_conditions TEXT,
  attachment_url VARCHAR(500),
  sub_total DOUBLE,
  cgst DOUBLE,
  sgst DOUBLE,
  grand_total DOUBLE,
  status ENUM('Draft', 'In Progress', 'Completed', 'Cancelled') DEFAULT 'Draft',
  purchase_order_number VARCHAR(255),
  purchase_order_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create table for work_order_items
CREATE TABLE IF NOT EXISTS work_order_items (
  item_id INT AUTO_INCREMENT PRIMARY KEY,
  work_order_id INT,
  item_name VARCHAR(255),
  hsn_sac VARCHAR(50),
  quantity INT,
  unit VARCHAR(50),
  rate DOUBLE,
  discount FLOAT,
  amount FLOAT,
  FOREIGN KEY (work_order_id) REFERENCES work_orders(work_order_id) ON DELETE CASCADE
);

-- Create table for pro_forma_invoice
CREATE TABLE IF NOT EXISTS pro_forma_invoice (
  proforma_id INT AUTO_INCREMENT PRIMARY KEY,
  proforma_number VARCHAR(20) NOT NULL UNIQUE,
  customer_id INT,
  customer_name VARCHAR(255) NOT NULL,
  proforma_date DATE NOT NULL,
  due_date DATE NOT NULL,
  payment_terms VARCHAR(255),
  subject VARCHAR(255),
  customer_notes TEXT,
  terms_and_conditions TEXT,
  attachment_url VARCHAR(500),
  sub_total DOUBLE,
  freight DOUBLE DEFAULT 0,
  cgst DOUBLE,
  sgst DOUBLE,
  igst DOUBLE DEFAULT 0,
  grand_total DOUBLE,
  status ENUM('Draft', 'Sent', 'Accepted', 'Rejected') DEFAULT 'Draft',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create table for pro_forma_invoice_items
CREATE TABLE IF NOT EXISTS pro_forma_invoice_items (
  item_id INT AUTO_INCREMENT PRIMARY KEY,
  proforma_id INT,
  item_detail VARCHAR(255),
  hsn_sac VARCHAR(50),
  quantity INT,
  unit VARCHAR(50),
  rate DOUBLE,
  discount FLOAT,
  amount FLOAT,
  FOREIGN KEY (proforma_id) REFERENCES pro_forma_invoice(proforma_id) ON DELETE CASCADE
);