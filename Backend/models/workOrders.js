const db = require('../config/db');

exports.getAll = (cb) => {
  db.query('SELECT * FROM work_orders', cb);
};

exports.create = (data, cb) => {
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

exports.update = (id, data, cb) => {
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

exports.remove = (id, cb) => {
  db.query('DELETE FROM work_orders WHERE work_order_id=?', [id], cb);
};

exports.updateStatus = (id, status, cb) => {
  db.query('UPDATE work_orders SET status = ? WHERE work_order_id = ?', [status, id], cb);
};
