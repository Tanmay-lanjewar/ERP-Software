const db = require('../config/db');

exports.getAll = (cb) => {
  db.query('SELECT * FROM products', cb);
};

exports.create = (data, cb) => {
  const { product_name, sku, purchase_price, sale_price, unit, description, quantity } = data;
  db.query(
    'INSERT INTO products (product_name, sku, purchase_price, sale_price, unit, description, quantity) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [product_name, sku, purchase_price, sale_price, unit, description, quantity],
    cb
  );
};

exports.update = (id, data, cb) => {
  const { product_name, sku, purchase_price, sale_price, unit, description, quantity } = data;
  db.query(
    'UPDATE products SET product_name=?, sku=?, purchase_price=?, sale_price=?, unit=?, description=?, quantity=? WHERE id=?',
    [product_name, sku, purchase_price, sale_price, unit, description, quantity, id],
    cb
  );
};

exports.remove = (id, cb) => {
  db.query('DELETE FROM products WHERE id=?', [id], cb);
};
