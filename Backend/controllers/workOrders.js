const db = require('../config/db');

// Get all workorders
exports.getAllWorkOrders = (cb) => {
  db.query('SELECT * FROM work_orders', cb);
};

// Create a new workorder
exports.createWorkOrder = (data, cb) => {
  const {
    work_order_number, customer_name, work_order_date, due_date, payment_terms,
    subject, customer_notes, terms_and_conditions, attachment_url,
    sub_total, cgst, sgst, grand_total, status
  } = data;

  db.query(
    `INSERT INTO work_orders (
      work_order_number, customer_name, work_order_date, due_date, payment_terms,
      subject, customer_notes, terms_and_conditions, attachment_url,
      sub_total, cgst, sgst, grand_total, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      work_order_number, customer_name, work_order_date, due_date, payment_terms,
      subject, customer_notes, terms_and_conditions, attachment_url,
      sub_total, cgst, sgst, grand_total, status || 'Draft'
    ],
    cb
  );
};

// Update an existing workorder
exports.updateWorkOrder = (id, data, cb) => {
  const {
    work_order_number, customer_name, work_order_date, due_date, payment_terms,
    subject, customer_notes, terms_and_conditions, attachment_url,
    sub_total, cgst, sgst, grand_total, status
  } = data;

  db.query(
    `UPDATE work_orders SET
      work_order_number=?, customer_name=?, work_order_date=?, due_date=?, payment_terms=?,
      subject=?, customer_notes=?, terms_and_conditions=?, attachment_url=?,
      sub_total=?, cgst=?, sgst=?, grand_total=?, status=?
      WHERE work_order_id=?`,
    [
      work_order_number, customer_name, work_order_date, due_date, payment_terms,
      subject, customer_notes, terms_and_conditions, attachment_url,
      sub_total, cgst, sgst, grand_total, status, id
    ],
    cb
  );
};

// Delete a workorder
exports.deleteWorkOrder = (id, cb) => {
  db.query('DELETE FROM work_orders WHERE work_order_id=?', [id], cb);
};

// Update status of a workorder
exports.updateWorkOrderStatus = (id, status, cb) => {
  db.query('UPDATE work_orders SET status = ? WHERE work_order_id = ?', [status, id], cb);
};
