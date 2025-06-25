const db = require('../config/db');

exports.getAll = (callback) => {
  db.query('SELECT * FROM taxes', callback);
};

exports.create = (data, callback) => {
  const { tax_name, tax_rate, tax_code, details } = data;
  db.query('INSERT INTO taxes (tax_name, tax_rate, tax_code, details) VALUES (?, ?, ?, ?)', 
    [tax_name, tax_rate, tax_code, details], callback);
};

exports.update = (id, data, callback) => {
  const { tax_name, tax_rate, tax_code, details } = data;
  db.query('UPDATE taxes SET tax_name=?, tax_rate=?, tax_code=?, details=? WHERE id=?',
    [tax_name, tax_rate, tax_code, details, id], callback);
};

exports.remove = (id, callback) => {
  db.query('DELETE FROM taxes WHERE id=?', [id], callback);
};
