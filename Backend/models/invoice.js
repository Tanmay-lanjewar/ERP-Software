// models/invoice.js
const db = require('../config/db');

// Utility to promisify db.query (optional, but helpful for existing async logic)
function query(sql, values = []) {
  return new Promise((resolve, reject) => {
    db.query(sql, values, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
}

const invoice = {
  getAll: (callback) => {
    db.query(
      'SELECT invoice_id, invoice_number, customer_id, customer_name, invoice_date, expiry_date, subject, customer_notes, terms_and_conditions, sub_total, cgst, sgst, grand_total, status FROM invoice',
      callback
    );
  },

  getById: (id, callback) => {
    db.query(
      'SELECT invoice_id, invoice_number, customer_id, customer_name, invoice_date, expiry_date, subject, customer_notes, terms_and_conditions, sub_total, cgst, sgst, grand_total, status FROM invoice WHERE invoice_id = ?',
      [id],
      (err, results) => {
        if (err) return callback(err);
        callback(null, results[0]);
      }
    );
  },

  getItemsByInvoiceId: (invoiceId, callback) => {
    db.query('SELECT * FROM invoice_items WHERE invoice_id = ?', [invoiceId], callback);
  },


  getInvoiceSummary: (callback) => {
    db.query(
      `SELECT 
        COUNT(*) AS total,
        SUM(CASE WHEN status = 'Draft' THEN 1 ELSE 0 END) AS draft,
        SUM(CASE WHEN status = 'Partial' THEN 1 ELSE 0 END) AS partial,
        SUM(CASE WHEN status = 'Paid' THEN 1 ELSE 0 END) AS paid
      FROM invoice`,
      (err, rows) => {
        if (err) return callback(err);
        callback(null, rows[0]);
      }
    );
  },

  getRecentInvoices: (callback) => {
    db.query(
      `SELECT invoice_id AS id, invoice_number AS name, customer_name AS client_name, status, invoice_date AS date FROM invoice ORDER BY invoice_date DESC LIMIT 4`,
      (err, rows) => {
        if (err) return callback(err);
        callback(null, rows);
      }
    );
  },

  getInvoicesOverTime: (callback) => {
    db.query(
      `SELECT DATE_FORMAT(invoice_date,  '%b') AS name, COUNT(*) AS invoices FROM invoice GROUP BY name, MONTH(invoice_date) ORDER BY MONTH(invoice_date) LIMIT 6`,
      (err, rows) => {
        if (err) return callback(err);
        callback(null, rows);
      }
    );
  },

  // Get the next invoice number based on active financial year
  getNextInvoiceNumber: (callback) => {
    db.query(
      'SELECT start_date FROM financial_years WHERE is_active = TRUE',
      (err, financialYears) => {
        if (err) return callback(err);

        if (financialYears.length === 0) {
          return callback(new Error('No active financial year found'));
        }

        const startDate = new Date(financialYears[0].start_date);
        const startYear = startDate.getFullYear();
        const endYear = (startYear + 1) % 100;
        const financialYear = `${startYear}-${endYear.toString().padStart(2, '0')}`;
        const counterId = `invoice_${financialYear}`;

        db.query('SELECT seq FROM counters WHERE id = ?', [counterId], (err, counterResult) => {
          if (err) return callback(err);

          let nextSeq;
          if (counterResult.length === 0) {
            nextSeq = 1;
            db.query('INSERT INTO counters (id, seq) VALUES (?, ?)', [counterId, nextSeq], (err) => {
              if (err) return callback(err);
              const invoiceNumber = `ME/${financialYear}/${nextSeq.toString().padStart(3, '0')}`;
              callback(null, { nextInvoiceNumber: invoiceNumber });
            });
          } else {
            nextSeq = counterResult[0].seq + 1;
            db.query('UPDATE counters SET seq = ? WHERE id = ?', [nextSeq, counterId], (err) => {
              if (err) return callback(err);
              const invoiceNumber = `ME/${financialYear}/${nextSeq.toString().padStart(3, '0')}`;
              callback(null, { nextInvoiceNumber: invoiceNumber });
            });
          }
        });
      }
    );
  },

  create: (data, items = [], callback) => {
    if (!Array.isArray(items) || items.length === 0) {
      return callback(new Error('At least one item is required'));
    }

    let sub_total = 0;
    items.forEach(item => {
      const quantity = parseFloat(item.quantity) || 0;
      const rate = parseFloat(item.rate) || 0;
      const discount = parseFloat(item.discount) || 0;
      const amount = (quantity * rate) - discount;
      item.amount = parseFloat(amount.toFixed(2));
      sub_total += amount;
      // Assuming getProductNameById is also callback based or handled separately
      // If item.item_detail needs a lookup, it will also need to be callback-based
    });

    sub_total = parseFloat(sub_total.toFixed(2));
    const cgst = parseFloat((sub_total * 0.09).toFixed(2));
    const sgst = parseFloat((sub_total * 0.09).toFixed(2));
    const grand_total = parseFloat((sub_total + cgst + sgst).toFixed(2));

    invoice.getNextInvoiceNumber((err, result) => {
      if (err) return callback(err);
      const invoiceNumber = result.nextInvoiceNumber;

      const invoiceSql = `
        INSERT INTO invoice (
          invoice_number, customer_id, customer_name, invoice_date, expiry_date, subject,
          customer_notes, terms_and_conditions, sub_total, cgst, sgst, grand_total, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const invoiceValues = [
        invoiceNumber,
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
        data.status || 'Draft',
      ];

      db.query(invoiceSql, invoiceValues, (err, result) => {
        if (err) return callback(err);
        const invoiceId = result.insertId;

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
          item.amount,
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
            grand_total,
          });
        });
      });
    });
  },

  update: (id, data, items = [], callback) => {
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
      UPDATE invoice SET
        customer_id = ?, customer_name = ?, invoice_date = ?, expiry_date = ?,
        subject = ?, customer_notes = ?, terms_and_conditions = ?,
        sub_total = ?, cgst = ?, sgst = ?, grand_total = ?, status = ?
      WHERE invoice_id = ?
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
      data.status || 'Draft',
      id,
    ];

    db.query(invoiceSql, invoiceValues, (err) => {
      if (err) return callback(err);

      db.query(`DELETE FROM invoice_items WHERE invoice_id = ?`, [id], (deleteErr) => {
        if (deleteErr) return callback(deleteErr);

        if (items.length > 0) {
          const itemSql = `
            INSERT INTO invoice_items (
              invoice_id, item_detail, quantity, rate, discount, amount
            ) VALUES ?
          `;
          const itemValues = items.map(item => [
            id,
            item.item_detail,
            item.quantity,
            item.rate,
            item.discount,
            item.amount,
          ]);
          db.query(itemSql, [itemValues], (itemErr, itemResult) => {
            if (itemErr) return callback(itemErr);
            callback(null, {
              invoiceId: id,
              itemsUpdated: itemResult.affectedRows,
              sub_total,
              cgst,
              sgst,
              grand_total,
            });
          });
        } else {
          callback(null, { invoiceId: id, itemsUpdated: 0, sub_total, cgst, sgst, grand_total });
        }
      });
    });
  },

  remove: (id, callback) => {
    db.query('DELETE FROM invoice_items WHERE invoice_id = ?', [id], (err) => {
      if (err) return callback(err);
      db.query('DELETE FROM invoice WHERE invoice_id = ?', [id], callback);
    });
  },
};

module.exports = invoice;

// Helper to fetch product name by id
function getProductNameById(productId, callback) {
  if (!productId) return callback(null, '');
  db.query('SELECT product_name FROM products_services WHERE id = ?', [productId], (err, rows) => {
    if (err) {
      console.error('Error fetching product name:', err);
      return callback(err);
    }
    callback(null, rows.length ? rows[0].product_name : '');
  });
}