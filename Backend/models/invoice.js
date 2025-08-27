const db = require('../config/db');

const invoice = {
  getAll: (callback) => {
    db.query('SELECT invoice_id, invoice_number, customer_id, customer_name, invoice_date, expiry_date, subject, customer_notes, terms_and_conditions, sub_total, cgst, sgst, grand_total, status FROM invoice', callback);
  },

  getById: (id, callback) => {
    db.query('SELECT invoice_id, invoice_number, customer_id, customer_name, invoice_date, expiry_date, subject, customer_notes, terms_and_conditions, sub_total, cgst, sgst, grand_total, status FROM invoice WHERE invoice_id = ?', [id], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
  },

  getItemsByInvoiceId: (invoiceId, callback) => {
    db.query('SELECT * FROM invoice_items WHERE invoice_id = ?', [invoiceId], callback);
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
    const grand_total = parseFloat((sub_total + cgst + sgst).toFixed(2));

    const invoiceSql = `
      INSERT INTO invoice (
        customer_id, customer_name, invoice_date, expiry_date, subject,
        customer_notes, terms_and_conditions,
        sub_total, cgst, sgst, grand_total, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const invoiceValues = [
      data.customer_id,
      data.customer_name,
      data.invoice_date,
      data.expiry_date,
      data.subject,
      data.customer_notes,
      data.terms_and_conditions,
      sub_total,
      cgst,
      sgst,
      grand_total,
      data.status || 'Draft'
    ];

    db.query(invoiceSql, invoiceValues, (err, result) => {
      if (err) return callback(err);

      const invoiceId = result.insertId;
      const invoiceNumber = `INV-${String(invoiceId).padStart(6, '0')}`;

      db.query('UPDATE invoice SET invoice_number = ? WHERE invoice_id = ?', [invoiceNumber, invoiceId], (err2) => {
        if (err2) return callback(err2);

        const itemSql = `
          INSERT INTO invoice_items (
            invoice_id, item_detail, quantity, rate, discount, amount
          ) VALUES ?
        `;

        const itemValues = items.map(item => [
          invoiceId,
          item.item_detail,
          item.quantity,
          item.rate,
          item.discount,
          item.amount
        ]);

        db.query(itemSql, [itemValues], (itemErr, itemResult) => {
          if (itemErr) return callback(itemErr);
          callback(null, {
            invoiceId,
            invoiceNumber,
            itemsInserted: itemResult.affectedRows,
            sub_total,
            cgst,
            sgst,
            grand_total
          });
        });
      });
    });
  },

  remove: (id, callback) => {
    db.query('DELETE FROM invoice_items WHERE invoice_id = ?', [id], (err) => {
      if (err) return callback(err);
      db.query('DELETE FROM invoice WHERE invoice_id = ?', [id], callback);
    });
  }
};

module.exports = invoice;