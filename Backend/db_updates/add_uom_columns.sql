-- Select the database
USE erp_db;

-- Add UOM columns to work_orders table
ALTER TABLE work_orders 
ADD COLUMN uom_amount DECIMAL(10,2) DEFAULT 0.00 AFTER grand_total,
ADD COLUMN uom_description VARCHAR(255) DEFAULT NULL AFTER uom_amount;

-- Add UOM columns to purchase_orders table
ALTER TABLE purchase_orders 
ADD COLUMN uom_amount DECIMAL(10,2) DEFAULT 0.00 AFTER total,
ADD COLUMN uom_description VARCHAR(255) DEFAULT NULL AFTER uom_amount;

-- Update existing records to have 0.00 UOM amount
UPDATE work_orders SET uom_amount = 0.00 WHERE uom_amount IS NULL;
UPDATE purchase_orders SET uom_amount = 0.00 WHERE uom_amount IS NULL;