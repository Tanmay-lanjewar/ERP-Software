// models/purchase.js
const db = require('../config/db');


function query(sql, values = []) {
  return new Promise((resolve, reject) => {
    db.query(sql, values, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
}

exports.getNextPurchaseOrderNo = async (callback) => {
  try {
    console.log('Fetching active financial year...');
    const financialYears = await query('SELECT start_date FROM financial_years WHERE is_active = TRUE');
    console.log('Active financial years:', financialYears);
    if (financialYears.length === 0) {
      return callback(new Error('No active financial year found'));
    }

    // Extract year from start_date (e.g., '2025-04-01' -> '2025-26')
    const startDate = new Date(financialYears[0].start_date);
    const startYear = startDate.getFullYear();
    const endYear = (startYear + 1) % 100;
    const financialYear = `${startYear}-${endYear.toString().padStart(2, '0')}`;

    const counterId = `purchaseorder_${financialYear}`;

    // Fetch or initialize the counter
    console.log('Fetching counter for:', counterId);
    const counterResult = await query('SELECT seq FROM counters WHERE id = ?', [counterId]);
    console.log('Counter result:', counterResult);

    let nextSeq;
    if (counterResult.length === 0) {
      nextSeq = 1;
      await query('INSERT INTO counters (id, seq) VALUES (?, ?)', [counterId, nextSeq]);
    } else {
      nextSeq = counterResult[0].seq + 1;
      await query('UPDATE counters SET seq = ? WHERE id = ?', [nextSeq, counterId]);
    }

    // Generate purchase order number (e.g., PO/2025-26/001)
    const purchaseOrderNumber = `PO/${financialYear}/${nextSeq.toString().padStart(3, '0')}`;
    callback(null, { nextPurchaseOrderNumber: purchaseOrderNumber });


  } catch (error) {
    console.error('Error in getNextPurchaseOrderNo:', error);
    callback(error);
  }
}


// Get all purchase orders with items
exports.getAll = (callback) => {
  const query = `
    SELECT po.*, poi.*, v.*
    FROM purchase_orders po
    LEFT JOIN purchase_order_items poi ON po.id = poi.purchase_order_id
    LEFT JOIN vendors v ON po.vendor_name = v.vendor_name
  `;
  db.query(query, callback);
};

exports.getById = (id, callback) => {
  const query = `
    SELECT po.*, poi.*, 
           v.vendor_name, v.company_name, v.display_name, v.email, v.phone, v.pan, v.gst,
           v.billing_address1, v.billing_address2, v.billing_city, v.billing_state, v.billing_pincode,
           v.billing_recipient_name, v.billing_fax, v.billing_phone,
           v.shipping_address1, v.shipping_address2, v.shipping_city, v.shipping_state, v.shipping_pincode,
           v.shipping_recipient_name, v.shipping_fax, v.shipping_phone
    FROM purchase_orders po
    LEFT JOIN purchase_order_items poi ON po.id = poi.purchase_order_id
    LEFT JOIN vendors v ON LOWER(po.vendor_name) = LOWER(v.vendor_name)
    WHERE po.id = ? OR po.purchase_order_no = ?
    GROUP BY poi.id
  `;
  db.query(query, [id, id], callback);
};

// Create purchase order with items
exports.create = (data, callback) => {
  const poData = {
    purchase_order_no: data.purchase_order_no,
    delivery_to: data.delivery_to,
    delivery_address: data.delivery_address,
    vendor_name: data.vendor_name,
    vendor_id: data.vendor_id, // Add vendor_id
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

// Update purchase order
exports.update = (id, data, callback) => {
  const updateQuery = `
    UPDATE purchase_orders SET 
      purchase_order_no = ?, financial_year = ?, delivery_to = ?, delivery_address = ?, vendor_name = ?, vendor_id = ?,
      purchase_order_date = ?, delivery_date = ?, payment_terms = ?, due_date = ?,
      customer_notes = ?, terms_and_conditions = ?, sub_total = ?, cgst = ?, sgst = ?, total = ?, attachment = ?
    WHERE id = ?
  `;

  const values = [
    data.purchase_order_no, data.financial_year, data.delivery_to, data.delivery_address, data.vendor_name, data.vendor_id,
    data.purchase_order_date, data.delivery_date, data.payment_terms, data.due_date,
    data.customer_notes, data.terms_and_conditions, data.sub_total,
    data.cgst, data.sgst, data.total, data.attachment, id
  ];

  db.query(updateQuery, values, callback);
};;