const db = require('../config/db');

exports.getAll = (cb) => {
  db.query('SELECT * FROM customers', cb);
};

exports.create = (data, cb) => {
  const {
    customer_name, email, mobile, office_no, address, pan, gst, country, state, currency,
    billing_address, billing_city, billing_state, billing_pincode,
    shipping_address, shipping_city, shipping_state, shipping_pincode
  } = data;

  db.query(
    `INSERT INTO customers (
      customer_name, email, mobile, office_no, address, pan, gst, country, state, currency,
      billing_address, billing_city, billing_state, billing_pincode,
      shipping_address, shipping_city, shipping_state, shipping_pincode
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      customer_name, email, mobile, office_no, address, pan, gst, country, state, currency,
      billing_address, billing_city, billing_state, billing_pincode,
      shipping_address, shipping_city, shipping_state, shipping_pincode
    ],
    cb
  );
};

exports.update = (id, data, cb) => {
  const {
    customer_name, email, mobile, office_no, address, pan, gst, country, state, currency,
    billing_address, billing_city, billing_state, billing_pincode,
    shipping_address, shipping_city, shipping_state, shipping_pincode
  } = data;

  db.query(
    `UPDATE customers SET
      customer_name=?, email=?, mobile=?, office_no=?, address=?, pan=?, gst=?, country=?, state=?, currency=?,
      billing_address=?, billing_city=?, billing_state=?, billing_pincode=?,
      shipping_address=?, shipping_city=?, shipping_state=?, shipping_pincode=?
     WHERE id=?`,
    [
      customer_name, email, mobile, office_no, address, pan, gst, country, state, currency,
      billing_address, billing_city, billing_state, billing_pincode,
      shipping_address, shipping_city, shipping_state, shipping_pincode, id
    ],
    cb
  );
};

exports.remove = (id, cb) => {
  db.query('DELETE FROM customers WHERE id=?', [id], cb);
};

