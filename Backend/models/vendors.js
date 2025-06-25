const db = require('../config/db');

exports.getAll = (callback) => {
  db.query('SELECT * FROM vendors', callback);
};

exports.create = (data, callback) => {
  const { vendor_name, phone, gst, pan, address, billing_address, city, state, pincode } = data;
  db.query(
    'INSERT INTO vendors (vendor_name, phone, gst, pan, address, billing_address, city, state, pincode) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [vendor_name, phone, gst, pan, address, billing_address, city, state, pincode],
    callback
  );
};

exports.update = (id, data, callback) => {
  const { vendor_name, phone, gst, pan, address, billing_address, city, state, pincode } = data;
  db.query(
    'UPDATE vendors SET vendor_name=?, phone=?, gst=?, pan=?, address=?, billing_address=?, city=?, state=?, pincode=? WHERE id=?',
    [vendor_name, phone, gst, pan, address, billing_address, city, state, pincode, id],
    callback
  );
};

exports.remove = (id, callback) => {
  db.query('DELETE FROM vendors WHERE id=?', [id], callback);
};
