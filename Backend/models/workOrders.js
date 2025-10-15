const db = require('../config/db'); // assumes db is your MySQL connection
const { promisify } = require('util');
const query = promisify(db.query).bind(db);

const WorkOrder = {
  create: (data, callback) => {
    try {
      const {
        work_order_number, vendor_name, customer_name, work_order_date, due_date, payment_terms,
        subject, vendor_notes, customer_notes, terms_and_conditions, attachment_url,
        sub_total, cgst, sgst, grand_total, status , purchase_order_number, purchase_order_date
      } = data;

      // Use vendor_name if provided, otherwise fall back to customer_name for backward compatibility
      const finalVendorName = vendor_name || customer_name;
      const finalVendorNotes = vendor_notes || customer_notes;

      // Validate required fields
      if (!work_order_number || !finalVendorName || !work_order_date) {
        return callback(new Error('Missing required fields: work_order_number, vendor_name/customer_name, work_order_date'), null);
      }

    const sql = `
      INSERT INTO work_orders (
        work_order_number, customer_name, work_order_date, due_date, payment_terms,
        subject, customer_notes, terms_and_conditions, attachment_url,
        sub_total, cgst, sgst, grand_total, status , purchase_order_number, purchase_order_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? , ?, ?)
    `;

    db.query(sql, [
      work_order_number, finalVendorName, work_order_date, due_date, payment_terms,
      subject, finalVendorNotes, terms_and_conditions, attachment_url,
      sub_total, cgst, sgst, grand_total, status , purchase_order_number, purchase_order_date
    ], (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return callback(err);
      }
      callback(null, result);
    });
    } catch (error) {
      console.error('Work order creation failed:', error);
      callback(error);
    }
  },

  getAll: async (callback) => {
    try {
      // Get active financial year with date range
      const activeFinancialYear = await query(
        'SELECT start_date, end_date, id as financial_year_id FROM financial_years WHERE is_active = TRUE'
      );
      
      if (activeFinancialYear.length === 0) {
        return callback(new Error('No active financial year found'));
      }
      
      const { start_date, end_date, financial_year_id } = activeFinancialYear[0];
      
      // Query work orders where work_order_date falls within the active financial year
      const sql = `
        SELECT 
          wo.*,
          fy.start_date as fy_start_date,
          fy.end_date as fy_end_date,
          CONCAT('FY ', YEAR(fy.start_date), '-', RIGHT(YEAR(fy.end_date), 2)) as financial_year_name
        FROM work_orders wo
        LEFT JOIN financial_years fy ON fy.id = ?
        WHERE DATE(wo.work_order_date) >= DATE(?) AND DATE(wo.work_order_date) <= DATE(?)
        ORDER BY wo.work_order_date DESC
      `;
      
      db.query(sql, [financial_year_id, start_date, end_date], callback);
    } catch (err) {
      callback(err);
    }
  },

  getById: (id, callback) => {
    const sql = `
      SELECT
        wo.*,      
        v.vendor_name, v.billing_recipient_name, v.billing_address1, v.billing_address2, v.billing_city, v.billing_state, v.billing_pincode, v.billing_country, v.gst,
        v.shipping_recipient_name, v.shipping_address1, v.shipping_address2, v.shipping_city, v.shipping_state, v.shipping_pincode, v.shipping_country
      FROM
        work_orders wo
      LEFT JOIN
        vendors v ON wo.customer_name = v.vendor_name
      WHERE
        wo.work_order_id = ?
    `;
    db.query(sql, [id], callback);
  },

  update: (id, data, callback) => {
    const {
      work_order_number, vendor_name, customer_name, work_order_date, due_date, payment_terms,
      subject, vendor_notes, customer_notes, terms_and_conditions, attachment_url,
      sub_total, cgst, sgst, grand_total, status, purchase_order_number, purchase_order_date
    } = data;

    // Use vendor_name if provided, otherwise fall back to customer_name for backward compatibility
    const finalVendorName = vendor_name || customer_name;
    const finalVendorNotes = vendor_notes || customer_notes;

    const sql = `
      UPDATE work_orders SET
        work_order_number = ?, customer_name = ?, work_order_date = ?, due_date = ?, payment_terms = ?,
        subject = ?, customer_notes = ?, terms_and_conditions = ?, attachment_url = ?,
        sub_total = ?, cgst = ?, sgst = ?, grand_total = ?, status = ?, purchase_order_number = ?, purchase_order_date = ?
      WHERE work_order_id = ?
    `;

    db.query(sql, [
      work_order_number, finalVendorName, work_order_date, due_date, payment_terms,
      subject, finalVendorNotes, terms_and_conditions, attachment_url,
      sub_total, cgst, sgst, grand_total, status, purchase_order_number, purchase_order_date, id
    ], callback);
  },

  remove: (id, callback) => {
    db.query('DELETE FROM work_orders WHERE work_order_id = ?', [id], callback);
  }
};

module.exports = WorkOrder;
