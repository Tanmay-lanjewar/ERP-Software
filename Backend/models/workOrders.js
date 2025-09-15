const db = require('../config/db'); // assumes db is your MySQL connection

const WorkOrder = {
  create: (data, callback) => {
    try {
      const {
        work_order_number, customer_name, work_order_date, due_date, payment_terms,
        subject, customer_notes, terms_and_conditions, attachment_url,
        sub_total, cgst, sgst, grand_total, status , purchase_order_number, purchase_order_date
      } = data;

      // Validate required fields
      if (!work_order_number || !customer_name || !work_order_date) {
        return callback(new Error('Missing required fields: work_order_number, customer_name, work_order_date'), null);
      }

    const sql = `
      INSERT INTO work_orders (
        work_order_number, customer_name, work_order_date, due_date, payment_terms,
        subject, customer_notes, terms_and_conditions, attachment_url,
        sub_total, cgst, sgst, grand_total, status , purchase_order_number, purchase_order_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? , ?, ?)
    `;

    db.query(sql, [
      work_order_number, customer_name, work_order_date, due_date, payment_terms,
      subject, customer_notes, terms_and_conditions, attachment_url,
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

  getAll: (callback) => {
    db.query('SELECT * FROM work_orders', callback);
  },

  getById: (id, callback) => {
    db.query('SELECT * FROM work_orders WHERE work_order_id = ?', [id], callback);
  },

  update: (id, data, callback) => {
    const {
      customer_name, work_order_date, due_date, payment_terms,
      subject, customer_notes, terms_and_conditions, attachment_url,
      sub_total, cgst, sgst, grand_total, status 
    } = data;

    const sql = `
      UPDATE work_orders SET
        customer_name = ?, work_order_date = ?, due_date = ?, payment_terms = ?,
        subject = ?, customer_notes = ?, terms_and_conditions = ?, attachment_url = ?,
        sub_total = ?, cgst = ?, sgst = ?, grand_total = ?, status = ? 
      WHERE work_order_id = ?
    `;

    db.query(sql, [
      customer_name, work_order_date, due_date, payment_terms,
      subject, customer_notes, terms_and_conditions, attachment_url,
      sub_total, cgst, sgst, grand_total, status, id 
    ], callback);
  },

  remove: (id, callback) => {
    db.query('DELETE FROM work_orders WHERE work_order_id = ?', [id], callback);
  }
};

module.exports = WorkOrder;
