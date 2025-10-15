-- Migration script to update work_orders table from customer fields to vendor fields
-- Run this script to update the database schema

-- Add new vendor columns
ALTER TABLE work_orders 
ADD COLUMN vendor_name VARCHAR(255) AFTER customer_name,
ADD COLUMN vendor_notes TEXT AFTER customer_notes;

-- Copy data from customer columns to vendor columns
UPDATE work_orders 
SET vendor_name = customer_name,
    vendor_notes = customer_notes;

-- Make vendor_name NOT NULL (since it's required)
ALTER TABLE work_orders 
MODIFY COLUMN vendor_name VARCHAR(255) NOT NULL;

-- Drop old customer columns (uncomment these lines after verifying the migration works)
-- ALTER TABLE work_orders DROP COLUMN customer_name;
-- ALTER TABLE work_orders DROP COLUMN customer_notes;

-- Note: The above DROP statements are commented out for safety.
-- After testing and confirming everything works, you can run them separately.