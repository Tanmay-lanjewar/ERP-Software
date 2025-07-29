const db = require('../config/db');

exports.createItems = (workOrderId, items, cb) => {
  if (!items || items.length === 0) {
    return cb(null, null);
  }

  const values = items.map(item => [
    workOrderId,
    item.item_detail,
    item.quantity,
    item.rate,
    item.discount,
    item.amount
  ]);

  const sql = `
    INSERT INTO work_order_items
    (work_order_id, item_detail, quantity, rate, discount, amount)
    VALUES ?
  `;

  db.query(sql, [values], cb);
};

exports.getItemsByWorkOrderId = (workOrderId, cb) => {
  const sql = 'SELECT * FROM work_order_items WHERE work_order_id = ?';
  db.query(sql, [workOrderId], cb);
};

exports.deleteItemsByWorkOrderId = (workOrderId, cb) => {
  const sql = 'DELETE FROM work_order_items WHERE work_order_id = ?';
  db.query(sql, [workOrderId], cb);
};
