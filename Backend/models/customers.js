const db = require('../config/db');

const Customer = {
  getAll: (cb) => {
    db.query('SELECT * FROM customers', cb);
  },

  getById: (id, cb) => {
    db.query('SELECT * FROM customers WHERE id = ?', [id], (err, results) => {
      if (err) return cb(err);
      cb(null, results[0]);
    });
  },

  create: (data, cb) => {
    const {
      customer_type, title, customer_name, company_name, display_name,
      email, mobile, office_no, pan, gst, currency, document_path,
      billing_recipient_name, billing_country, billing_address1, billing_address2,
      billing_city, billing_state, billing_pincode, billing_fax, billing_phone,
      shipping_recipient_name, shipping_country, shipping_address1, shipping_address2,
      shipping_city, shipping_state, shipping_pincode, shipping_fax, shipping_phone,
      remark, status
    } = data;

    db.query(
      `INSERT INTO customers (
        customer_type, title, customer_name, company_name, display_name,
        email, mobile, office_no, pan, gst, currency, document_path,
        billing_recipient_name, billing_country, billing_address1, billing_address2,
        billing_city, billing_state, billing_pincode, billing_fax, billing_phone,
        shipping_recipient_name, shipping_country, shipping_address1, shipping_address2,
        shipping_city, shipping_state, shipping_pincode, shipping_fax, shipping_phone,
        remark, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        customer_type, title, customer_name, company_name, display_name,
        email, mobile, office_no, pan, gst, currency, document_path,
        billing_recipient_name, billing_country, billing_address1, billing_address2,
        billing_city, billing_state, billing_pincode, billing_fax, billing_phone,
        shipping_recipient_name, shipping_country, shipping_address1, shipping_address2,
        shipping_city, shipping_state, shipping_pincode, shipping_fax, shipping_phone,
        remark, status || 'Active'
      ],
      cb
    );
  },

  update: async (id, data) => {
    const {
      customer_type, title, customer_name, company_name, display_name,
      email, mobile, office_no, pan, gst, currency, document_path,
      billing_recipient_name, billing_country, billing_address1, billing_address2,
      billing_city, billing_state, billing_pincode, billing_fax, billing_phone,
      shipping_recipient_name, shipping_country, shipping_address1, shipping_address2,
      shipping_city, shipping_state, shipping_pincode, shipping_fax, shipping_phone,
      remark, status
    } = data;

    const sql = `UPDATE customers SET
      customer_type=?, title=?, customer_name=?, company_name=?, display_name=?,
      email=?, mobile=?, office_no=?, pan=?, gst=?, currency=?, document_path=?,
      billing_recipient_name=?, billing_country=?, billing_address1=?, billing_address2=?,
      billing_city=?, billing_state=?, billing_pincode=?, billing_fax=?, billing_phone=?,
      shipping_recipient_name=?, shipping_country=?, shipping_address1=?, shipping_address2=?,
      shipping_city=?, shipping_state=?, shipping_pincode=?, shipping_fax=?, shipping_phone=?,
      remark=?, status=?
      WHERE id=?`;

    const values = [
      customer_type, title, customer_name, company_name, display_name,
      email, mobile, office_no, pan, gst, currency, document_path,
      billing_recipient_name, billing_country, billing_address1, billing_address2,
      billing_city, billing_state, billing_pincode, billing_fax, billing_phone,
      shipping_recipient_name, shipping_country, shipping_address1, shipping_address2,
      shipping_city, shipping_state, shipping_pincode, shipping_fax, shipping_phone,
      remark, status || 'Active', id
    ];

    const [result] = await pool.query(sql, values);
    return result;
  },

  remove: async (id) => {
    const [result] = await pool.query('DELETE FROM customers WHERE id=?', [id]);
    return result;
  },

  updateStatus: async (id, status) => {
    const [result] = await pool.query('UPDATE customers SET status = ? WHERE id = ?', [status, id]);
    return result;
  },
};

module.exports = Customer;