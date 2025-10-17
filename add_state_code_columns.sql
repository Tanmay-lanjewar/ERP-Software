-- Add state code columns to customers table
USE erp_db;

ALTER TABLE customers 
ADD COLUMN billing_state_code VARCHAR(10) AFTER billing_state,
ADD COLUMN shipping_state_code VARCHAR(10) AFTER shipping_state;

-- Add comments for clarity
ALTER TABLE customers 
MODIFY COLUMN billing_state_code VARCHAR(10) COMMENT 'State code for billing address (e.g., 27 for Maharashtra)',
MODIFY COLUMN shipping_state_code VARCHAR(10) COMMENT 'State code for shipping address (e.g., 27 for Maharashtra)';