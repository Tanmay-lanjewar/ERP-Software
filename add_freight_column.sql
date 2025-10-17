-- SQL script to add freight column to invoice, quotation, and purchase_orders tables
-- Run this script to add freight functionality to the ERP system

USE erp_db;

-- Add freight column to invoice table
ALTER TABLE invoice 
ADD COLUMN freight DECIMAL(10,2) DEFAULT 0.00 AFTER sub_total;

-- Add freight column to quotation table  
ALTER TABLE quotation 
ADD COLUMN freight DECIMAL(10,2) DEFAULT 0.00 AFTER sub_total;

-- Add freight column to purchase_orders table
ALTER TABLE purchase_orders 
ADD COLUMN freight DECIMAL(10,2) DEFAULT 0.00 AFTER sub_total;

-- Verify the changes
DESCRIBE invoice;
DESCRIBE quotation;
DESCRIBE purchase_orders;