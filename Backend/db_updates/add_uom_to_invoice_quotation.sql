-- Add UOM columns to invoice_items and quotation_items tables

-- Add UOM columns to invoice_items table
ALTER TABLE invoice_items 
ADD COLUMN uom_amount DECIMAL(10,2) DEFAULT 0.00 AFTER amount,
ADD COLUMN uom_description VARCHAR(255) DEFAULT NULL AFTER uom_amount;

-- Add UOM columns to quotation_items table  
ALTER TABLE quotation_items
ADD COLUMN uom_amount DECIMAL(10,2) DEFAULT 0.00 AFTER amount,
ADD COLUMN uom_description VARCHAR(255) DEFAULT NULL AFTER uom_amount;

-- Update existing records to set uom_amount to 0.00 if NULL
UPDATE invoice_items SET uom_amount = 0.00 WHERE uom_amount IS NULL;
UPDATE quotation_items SET uom_amount = 0.00 WHERE uom_amount IS NULL;