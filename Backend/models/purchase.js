const db = require('../config/db');

// Get all purchase orders with items
exports.getAll = (callback) => {
  const query = `
    SELECT po.*, poi.* 
    FROM purchase_orders po
    LEFT JOIN purchase_order_items poi ON po.id = poi.purchase_order_id
  `;
  db.query(query, callback);
};

// Get single purchase order by ID
exports.getById = (id, callback) => {
  const query = `
    SELECT po.*, poi.* 
    FROM purchase_orders po
    LEFT JOIN purchase_order_items poi ON po.id = poi.purchase_order_id
    WHERE po.id = ?
  `;
  db.query(query, [id], callback);
};

// Create purchase order with items
exports.create = (data, callback) => {
  const poData = {
    purchase_order_no: data.purchase_order_no,
    delivery_to: data.delivery_to,
    delivery_address: data.delivery_address,
    vendor_name: data.vendor_name,
    purchase_order_date: data.purchase_order_date,
    delivery_date: data.delivery_date,
    payment_terms: data.payment_terms,
    due_date: data.due_date,
    customer_notes: data.customer_notes,
    terms_and_conditions: data.terms_and_conditions,
    sub_total: data.sub_total,
    cgst: data.cgst,
    sgst: data.sgst,
    total: data.total,
    attachment: data.attachment
  };

  db.query('INSERT INTO purchase_orders SET ?', poData, (err, result) => {
    if (err) return callback(err);
    
    const purchaseOrderId = result.insertId;

    const items = data.items.map(item => [
      purchaseOrderId,
      item.item_name,
      item.qty,
      item.rate,
      item.discount,
      item.amount
    ]);

    db.query(`
      INSERT INTO purchase_order_items 
      (purchase_order_id, item_name, qty, rate, discount, amount) 
      VALUES ?
    `, [items], callback);
  });
};

// Update purchase order (without updating items for simplicity)
exports.update = (id, data, callback) => {
  const updateQuery = `
    UPDATE purchase_orders SET 
      purchase_order_no = ?, delivery_to = ?, delivery_address = ?, vendor_name = ?,
      purchase_order_date = ?, delivery_date = ?, payment_terms = ?, due_date = ?,
      customer_notes = ?, terms_and_conditions = ?, sub_total = ?, cgst = ?, sgst = ?, total = ?, attachment = ?
    WHERE id = ?
  `;

  const values = [
    data.purchase_order_no, data.delivery_to, data.delivery_address, data.vendor_name,
    data.purchase_order_date, data.delivery_date, data.payment_terms, data.due_date,
    data.customer_notes, data.terms_and_conditions, data.sub_total,
    data.cgst, data.sgst, data.total, data.attachment, id
  ];

  db.query(updateQuery, values, callback);
};
