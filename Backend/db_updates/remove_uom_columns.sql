-- Select the database
USE erp_db;

-- Remove UOM columns from purchase_order_items table
ALTER TABLE purchase_order_items 
DROP COLUMN IF EXISTS uom;

-- Remove UOM columns from work_orders table
ALTER TABLE work_orders 
DROP COLUMN IF EXISTS uom_amount,
DROP COLUMN IF EXISTS uom_description;

-- Remove UOM columns from purchase_orders table
ALTER TABLE purchase_orders 
DROP COLUMN IF EXISTS uom_amount,
DROP COLUMN IF EXISTS uom_description;

-- Remove UOM columns from work_order_items table if it exists
ALTER TABLE work_order_items 
DROP COLUMN IF EXISTS uom;