const db = require('../config/db');

const quotation = {
  getAll: (callback) => {
    db.query('SELECT * FROM quotation', callback);
  },

  getById: (id, callback) => {
    db.query('SELECT * FROM quotation WHERE quotation_id = ?', [id], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
  },

  getItemsByQuotationId: (quotationId, callback) => {
    db.query('SELECT * FROM quotation_items WHERE quotation_id = ?', [quotationId], callback);
  },

  create: (data, items = [], callback) => {
    if (!Array.isArray(items) || items.length === 0) {
      return callback(new Error("At least one item is required"));
    }

    let sub_total = 0;
    items.forEach(item => {
      const quantity = parseFloat(item.quantity) || 0;
      const rate = parseFloat(item.rate) || 0;
      const discount = parseFloat(item.discount) || 0;
      const amount = (quantity * rate) - discount;
      item.amount = parseFloat(amount.toFixed(2));
      sub_total += amount;
    });

    sub_total = parseFloat(sub_total.toFixed(2));
    const cgst = parseFloat((sub_total * 0.09).toFixed(2));
    const sgst = parseFloat((sub_total * 0.09).toFixed(2));
    const grand_total = parseFloat((sub_total + cgst + sgst).toFixed(2)); // ✅ Changed name here

    const quotationSql = `
      INSERT INTO quotation (
        customer_name, quotation_date, expiry_date, subject,
        customer_notes, terms_and_conditions,
        sub_total, cgst, sgst, grand_total, attachment_url, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const quotationValues = [
      data.customer_name,
      data.quotation_date,
      data.expiry_date,
      data.subject,
      data.customer_notes,
      data.terms_and_conditions,
      sub_total,
      cgst,
      sgst,
      grand_total, // ✅ Changed here
      data.attachment_url,
      data.status || 'Draft'
    ];

    db.query(quotationSql, quotationValues, (err, result) => {
      if (err) return callback(err);

      const quotationId = result.insertId;
      const quoteNumber = `QT-${String(quotationId).padStart(6, '0')}`;

      // Update quote_number in the same row
      db.query('UPDATE quotation SET quote_number = ? WHERE quotation_id = ?', [quoteNumber, quotationId], (err2) => {
        if (err2) return callback(err2);

      const itemSql = `
        INSERT INTO quotation_items (
          quotation_id, item_detail, quantity, rate, discount, amount
        ) VALUES ?
      `;

      const itemValues = items.map(item => [
        quotationId,
        item.item_detail,
        item.quantity,
        item.rate,
        item.discount,
        item.amount
      ]);

      db.query(itemSql, [itemValues], (itemErr, itemResult) => {
        if (itemErr) return callback(itemErr);
        callback(null, {
          quotationId,
            quoteNumber,
          itemsInserted: itemResult.affectedRows,
          sub_total,
          cgst,
          sgst,
          grand_total // ✅ Changed here
          });
        });
      });
    });
  },

  remove: (id, callback) => {
    db.query('DELETE FROM quotation_items WHERE quotation_id = ?', [id], (err) => {
      if (err) return callback(err);
      db.query('DELETE FROM quotation WHERE quotation_id = ?', [id], callback);
    });
  }
};

module.exports = quotation;
