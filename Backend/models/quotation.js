const db = require('../config/db');
const { promisify } = require('util');
const query = promisify(db.query).bind(db);

const quotation = {
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
      
      // Query quotations where quotation_date falls within the active financial year
      const sql = `
        SELECT 
          q.*,
          fy.start_date as fy_start_date,
          fy.end_date as fy_end_date,
          CONCAT('FY ', YEAR(fy.start_date), '-', RIGHT(YEAR(fy.end_date), 2)) as financial_year_name
        FROM quotation q
        LEFT JOIN financial_years fy ON fy.id = ?
        WHERE DATE(q.quotation_date) >= DATE(?) AND DATE(q.quotation_date) <= DATE(?)
        ORDER BY q.quotation_date DESC
      `;
      
      db.query(sql, [financial_year_id, start_date, end_date], callback);
    } catch (err) {
      callback(err);
    }
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

  getNextQuoteNumber: async (callback) => {
    try {
      // Fetch active financial year
      const financialYears = await new Promise((resolve, reject) => {
        db.query('SELECT start_date FROM financial_years WHERE is_active = TRUE', (err, results) => {
          if (err) return reject(err);
          resolve(results);
        });
      });

      if (financialYears.length === 0) {
        return callback(new Error('No active financial year found'));
      }

      const startYear = new Date(financialYears[0].start_date).getFullYear();
      const endYear = startYear + 1;
      const financialYear = `${startYear}-${endYear.toString().slice(-2)}`;
      const counterId = `quotation_${financialYear}`;

      // Start transaction to ensure atomicity
      await new Promise((resolve, reject) => {
        db.query('START TRANSACTION', (err) => {
          if (err) return reject(err);
          resolve();
        });
      });

      // Check if counter exists
      const counter = await new Promise((resolve, reject) => {
        db.query('SELECT seq FROM counters WHERE id = ?', [counterId], (err, results) => {
          if (err) return reject(err);
          resolve(results[0]);
        });
      });

      let nextSeq;
      if (!counter) {
        // Insert new counter with seq = 1
        await new Promise((resolve, reject) => {
          db.query('INSERT INTO counters (id, seq) VALUES (?, 1)', [counterId], (err) => {
            if (err) return reject(err);
            resolve();
          });
        });
        nextSeq = 1;
      } else {
        // Update existing counter
        nextSeq = counter.seq + 1;
        await new Promise((resolve, reject) => {
          db.query('UPDATE counters SET seq = seq + 1 WHERE id = ?', [counterId], (err) => {
            if (err) return reject(err);
            resolve();
          });
        });
      }

      // Commit transaction
      await new Promise((resolve, reject) => {
        db.query('COMMIT', (err) => {
          if (err) return reject(err);
          resolve();
        });
      });

      // Format quote number as ME/BESPL/NNN/YYYY-YY
      const quoteNumber = `ME/BESPL/${String(nextSeq).padStart(3, '0')}/${financialYear}`;
      callback(null, { nextQuoteNumber: quoteNumber });
    } catch (err) {
      // Rollback transaction on error
      await new Promise((resolve) => {
        db.query('ROLLBACK', () => resolve());
      });
      console.error('Error in getNextQuoteNumber:', err);
      callback(err);
    }
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

    // Get quote number
    quotation.getNextQuoteNumber((err, result) => {
      if (err) return callback(err);
      const quoteNumber = result.nextQuoteNumber;

      const quotationSql = `
        INSERT INTO quotation (
          customer_name, quote_number, quotation_date, expiry_date, subject,
          customer_notes, terms_and_conditions,
          sub_total, cgst, sgst, grand_total, attachment_url, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const quotationValues = [
        data.customer_name,
        quoteNumber,
        data.quotation_date,
        data.expiry_date,
        data.subject,
        data.customer_notes,
        data.terms_and_conditions,
        sub_total,
        cgst,
        sgst,
        grand_total,
        data.attachment_url,
        data.status || 'Draft'
      ];

      db.query(quotationSql, quotationValues, (err, result) => {
        if (err) return callback(err);

        const quotationId = result.insertId;

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
            grand_total
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