// models/invoice.js
const db = require('../config/db');


// Utility to promisify db.query
function query(sql, values = []) {
  return new Promise((resolve, reject) => {
    db.query(sql, values, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
}



const invoice = {
  getAll: async (callback) => {
    try {
      // Get active financial year with date range
      const activeFinancialYear = await query(
        'SELECT start_date, end_date, id as financial_year_id FROM financial_years WHERE is_active = TRUE'
      );
      
      if (activeFinancialYear.length === 0) {
        return callback(new Error('No active financial year found'));
      }
      
      const { start_date, end_date, financial_year_id } = activeFinancialYear[0];
      
      // Query invoices where invoice_date falls within the active financial year
      const sql = `
        SELECT 
          i.invoice_id, i.invoice_number, i.customer_id, i.customer_name, i.invoice_date, 
          i.expiry_date, i.subject, i.customer_notes, i.terms_and_conditions, 
          i.sub_total, i.cgst, i.sgst, i.grand_total, i.status,
          fy.start_date as fy_start_date,
          fy.end_date as fy_end_date,
          CONCAT('FY ', YEAR(fy.start_date), '-', RIGHT(YEAR(fy.end_date), 2)) as financial_year_name
        FROM invoice i
        LEFT JOIN financial_years fy ON fy.id = ?
        WHERE DATE(i.invoice_date) >= DATE(?) AND DATE(i.invoice_date) <= DATE(?)
        ORDER BY i.invoice_date DESC
      `;
      
      db.query(sql, [financial_year_id, start_date, end_date], callback);
    } catch (err) {
      callback(err);
    }
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

  // Get the next invoice number based on active financial year
  getNextInvoiceNumber: async (callback) => {
    try {
      // Fetch the active financial year
      const financialYears = await query(
        'SELECT start_date FROM financial_years WHERE is_active = TRUE'
      );

      if (financialYears.length === 0) {
        return callback(new Error('No active financial year found'));
      }

      // Extract year from start_date (e.g., '2025-04-01' -> '2025-26')
      const startDate = new Date(financialYears[0].start_date);
      const startYear = startDate.getFullYear();
      const endYear = (startYear + 1) % 100; // e.g., 2025 -> 26
      const financialYear = `${startYear}-${endYear.toString().padStart(2, '0')}`; // e.g., '2025-26'

      const counterId = `invoice_${financialYear}`; // e.g., 'invoice_2025-26'

      // Fetch or initialize the counter
      const counterResult = await query('SELECT seq FROM counters WHERE id = ?', [counterId]);

      let nextSeq;
      if (counterResult.length === 0) {
        // Initialize counter for the new financial year
        nextSeq = 1;
        await query('INSERT INTO counters (id, seq) VALUES (?, ?)', [counterId, nextSeq]);
      } else {
        // Increment existing counter
        nextSeq = counterResult[0].seq + 1;
        await query('UPDATE counters SET seq = ? WHERE id = ?', [nextSeq, counterId]);
      }

      // Generate invoice number (e.g., ME/2025-26/001)
      const invoiceNumber = `ME/${financialYear}/${nextSeq.toString().padStart(3, '0')}`;
      callback(null, { nextInvoiceNumber: invoiceNumber });
    } catch (err) {
      callback(err);
    }
  },

  create: async (data, items = [], callback) => {
    if (!Array.isArray(items) || items.length === 0) {
      return callback(new Error('At least one item is required'));
    }

    // Calculate totals
    let sub_total = 0;
    for (const item of items) {
      const quantity = parseFloat(item.quantity) || 0;
      const rate = parseFloat(item.rate) || 0;
      const discount = parseFloat(item.discount) || 0;
      const amount = quantity * rate - discount;
      item.amount = parseFloat(amount.toFixed(2));
      sub_total += amount;
      if (item.item_detail && !isNaN(item.item_detail)) {
        item.item_detail = await getProductNameById(item.item_detail);
      }
    };

    sub_total = parseFloat(sub_total.toFixed(2));
    const cgst = parseFloat((sub_total * 0.09).toFixed(2));
    const sgst = parseFloat((sub_total * 0.09).toFixed(2));
    const grand_total = parseFloat((sub_total + cgst + sgst).toFixed(2));

    // Get the next invoice number
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

        const itemValues = items.map((item) => [
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

  remove: (id, callback) => {
    db.query('DELETE FROM invoice_items WHERE invoice_id = ?', [id], (err) => {
      if (err) return callback(err);
      db.query('DELETE FROM invoice WHERE invoice_id = ?', [id], callback);
    });
  },
};

module.exports = invoice;


// Helper to fetch product name by id
async function getProductNameById(productId) {
  if (!productId) return '';
  try {
    const rows = await query('SELECT product_name FROM products_services WHERE id = ?', [productId]);
    return rows.length ? rows[0].product_name : '';
  } catch (err) {
    // In case of error, return empty string so that invoice creation can proceed
    console.error('Error fetching product name:', err);
    return '';
  }
}