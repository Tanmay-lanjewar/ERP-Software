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
    db.query('SELECT quotation_id, customer_name, quote_number, quotation_date, expiry_date, subject, customer_notes, terms_and_conditions, sub_total, freight, cgst, sgst, igst, grand_total, attachment_url, status FROM quotation WHERE quotation_id = ?', [id], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
  },

  getItemsByQuotationId: (quotationId, callback) => {
    db.query('SELECT * FROM quotation_items WHERE quotation_id = ?', [quotationId], callback);
  },

  getNextQuoteNumber: (callback) => {
    // Peek at the next quote number without incrementing the counter.
    db.query('START TRANSACTION', (err) => {
      if (err) return callback(err);

      db.query('SELECT start_date FROM financial_years WHERE is_active = TRUE', (err, financialYears) => {
        if (err) {
          return db.query('ROLLBACK', () => callback(err));
        }

        if (financialYears.length === 0) {
          return db.query('ROLLBACK', () => callback(new Error('No active financial year found')));
        }

        const startYear = new Date(financialYears[0].start_date).getFullYear();
        const endYear = startYear + 1;
        const financialYear = `${startYear}-${endYear.toString().slice(-2)}`;
        const counterId = `quotation_${financialYear}`;

        db.query('SELECT seq FROM counters WHERE id = ? FOR UPDATE', [counterId], (err, counter) => {
          if (err) {
            return db.query('ROLLBACK', () => callback(err));
          }

          let currentSeq = 0;
          if (counter.length === 0) {
            // Initialize counter at 0 so the first suggested number is 1
            db.query('INSERT INTO counters (id, seq) VALUES (?, 0)', [counterId], (err) => {
              if (err) return db.query('ROLLBACK', () => callback(err));
              currentSeq = 0;
              db.query('COMMIT', (err) => {
                if (err) return callback(err);
                const nextSeq = currentSeq + 1;
                const quoteNumber = `ME/BESPL/${String(nextSeq).padStart(3, '0')}/${financialYear}`;
                callback(null, { nextQuoteNumber: quoteNumber });
              });
            });
          } else {
            currentSeq = counter[0].seq;
            db.query('COMMIT', (err) => {
              if (err) return callback(err);
              const nextSeq = currentSeq + 1;
              const quoteNumber = `ME/BESPL/${String(nextSeq).padStart(3, '0')}/${financialYear}`;
              callback(null, { nextQuoteNumber: quoteNumber });
            });
          }
        });
      });
    });
  },

  create: (data, items = [], callback) => {
    if (!Array.isArray(items) || items.length === 0) {
      return callback(new Error("At least one item is required"));
    }

    // First, try to get customer billing state code by customer name
    db.query('SELECT billing_state_code FROM customers WHERE customer_name = ? LIMIT 1', [data.customer_name], (custErr, custResult) => {
      if (custErr) return callback(custErr);
      
      const billingStateCode = custResult.length > 0 ? (custResult[0].billing_state_code || '') : '';

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
      const freight = parseFloat(data.freight || 0);
      const subtotalWithFreight = sub_total + freight;
      
      // Conditional GST calculation based on customer billing state code
      let cgst = 0, sgst = 0, igst = 0;
      
      if (billingStateCode === '27') {
        // Maharashtra - use CGST/SGST
        cgst = parseFloat((subtotalWithFreight * 0.09).toFixed(2));
        sgst = parseFloat((subtotalWithFreight * 0.09).toFixed(2));
        igst = 0;
      } else {
        // Other states - use IGST
        cgst = 0;
        sgst = 0;
        igst = parseFloat((subtotalWithFreight * 0.18).toFixed(2));
      }
      
      const grand_total = parseFloat((subtotalWithFreight + cgst + sgst + igst).toFixed(2));

      // Determine the quote number: prefer manual provided by client, otherwise peek the next.
      const pickManualQuoteNumber = () => {
        return (
          data.quoteNumber ||
          data.quote_number ||
          data.quotation_number ||
          data.quotationNo ||
          data.quote_no ||
          null
        );
      };

      const extractSeqFromQuoteNumber = (qn) => {
        if (!qn || typeof qn !== 'string') return null;
        // Expected format: PREFIX/NNN/FINYEAR or similar. We'll take the numeric segment in the middle.
        const parts = qn.split('/');
        for (let p of parts) {
          const m = p.match(/^\d+$/);
          if (m) {
            const parsed = parseInt(m[0], 10);
            if (!isNaN(parsed)) return parsed;
          }
        }
        return null;
      };

      const manualQN = pickManualQuoteNumber();

      const proceedWithInsert = (quoteNumber, financialYearForCounter) => {
        
        const quotationSql = `
          INSERT INTO quotation (
            customer_name, quote_number, quotation_date, expiry_date, subject,
            customer_notes, terms_and_conditions,
            sub_total, freight, cgst, sgst, igst, grand_total, attachment_url, status
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
          freight,
          cgst,
          sgst,
          igst,
          grand_total,
          data.attachment_url,
          data.status || 'Draft'
        ];

        db.query(quotationSql, quotationValues, (err, result) => {
          if (err) return callback(err);

          const quotationId = result.insertId;

          const itemSql = `
            INSERT INTO quotation_items (
              quotation_id, item_detail, quantity, rate, discount, amount, uom_amount, uom_description
            ) VALUES ?
          `;

          const itemValues = items.map(item => [
            quotationId,
            item.item_detail,
            item.quantity,
            item.rate,
            item.discount,
            item.amount,
            item.uom_amount || 0,
            item.uom_description || ""
          ]);

          db.query(itemSql, [itemValues], (itemErr, itemResult) => {
            if (itemErr) return callback(itemErr);

            // After successful insert, advance the counter to the sequence we used (if applicable)
            const usedSeq = extractSeqFromQuoteNumber(quoteNumber);
            if (usedSeq && usedSeq > 0) {
              db.query('SELECT start_date FROM financial_years WHERE is_active = TRUE', (fyErr, fyRows) => {
                if (fyErr) {
                  // Don't fail the request due to counter sync; just log and continue
                  console.error('Failed to fetch financial year for counter sync', fyErr);
                } else if (fyRows.length > 0) {
                  const startYear = new Date(fyRows[0].start_date).getFullYear();
                  const endYear = startYear + 1;
                  const finYear = `${startYear}-${endYear.toString().slice(-2)}`;
                  const counterId = `quotation_${finYear}`;
                  db.query('UPDATE counters SET seq = GREATEST(seq, ?) WHERE id = ?', [usedSeq, counterId]);
                }
              });
            }
            callback(null, {
              quotationId,
              quoteNumber,
              itemsInserted: itemResult.affectedRows,
              sub_total,
              freight,
              cgst,
              sgst,
              igst,
              grand_total
            });
          });
        });
      };

      if (manualQN) {
        // Use the manual quote number as-is
        proceedWithInsert(manualQN);
      } else {
        // Peek next and use that for actual insert
        quotation.getNextQuoteNumber((err, result) => {
          if (err) return callback(err);
          const quoteNumber = result.nextQuoteNumber;
          proceedWithInsert(quoteNumber);
        });
      }
    });
  },

  update: (id, data, items = [], callback) => {
    // Handle status-only updates
    if (data.status && Object.keys(data).length === 1) {
      const statusSql = 'UPDATE quotation SET status = ? WHERE quotation_id = ?';
      db.query(statusSql, [data.status, id], (err, result) => {
        if (err) return callback(err);
        callback(null, { quotationId: id, status: data.status });
      });
      return;
    }

    // First, try to get customer billing state code by customer name
    db.query('SELECT billing_state_code FROM customers WHERE customer_name = ? LIMIT 1', [data.customer_name], (custErr, custResult) => {
      if (custErr) return callback(custErr);
      
      const billingStateCode = custResult.length > 0 ? (custResult[0].billing_state_code || '') : '';

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
      const freight = parseFloat(data.freight || 0);
      const subtotalWithFreight = sub_total + freight;
      
      // Conditional GST calculation based on customer billing state code
      let cgst = 0, sgst = 0, igst = 0;
      
      if (billingStateCode === '27') {
        // Maharashtra - use CGST/SGST
        cgst = parseFloat((subtotalWithFreight * 0.09).toFixed(2));
        sgst = parseFloat((subtotalWithFreight * 0.09).toFixed(2));
        igst = 0;
      } else {
        // Other states - use IGST
        cgst = 0;
        sgst = 0;
        igst = parseFloat((subtotalWithFreight * 0.18).toFixed(2));
      }
      
      const grand_total = parseFloat((subtotalWithFreight + cgst + sgst + igst).toFixed(2));

      const quotationSql = `
        UPDATE quotation SET
          customer_name = ?, quotation_date = ?, expiry_date = ?, subject = ?,
          customer_notes = ?, terms_and_conditions = ?,
          sub_total = ?, freight = ?, cgst = ?, sgst = ?, igst = ?, grand_total = ?, attachment_url = ?, status = ?
        WHERE quotation_id = ?
      `;

      const quotationValues = [
        data.customer_name,
        data.quotation_date,
        data.expiry_date,
        data.subject,
        data.customer_notes,
        data.terms_and_conditions,
        sub_total,
        freight,
        cgst,
        sgst,
        igst,
        grand_total,
        data.attachment_url,
        data.status || 'Draft',
        id
      ];

      db.query(quotationSql, quotationValues, (err) => {
        if (err) return callback(err);

        db.query(`DELETE FROM quotation_items WHERE quotation_id = ?`, [id], (deleteErr) => {
          if (deleteErr) return callback(deleteErr);

          if (items.length > 0) {
            const itemSql = `
              INSERT INTO quotation_items (
                quotation_id, item_detail, quantity, rate, discount, amount, uom_amount, uom_description
              ) VALUES ?
            `;

            const itemValues = items.map(item => [
              id,
              item.item_detail,
              item.quantity,
              item.rate,
              item.discount,
              item.amount,
              item.uom_amount || 0,
              item.uom_description || ""
            ]);

            db.query(itemSql, [itemValues], (itemErr, itemResult) => {
              if (itemErr) return callback(itemErr);
              callback(null, {
                quotationId: id,
                itemsUpdated: itemResult.affectedRows,
                sub_total,
                freight,
                cgst,
                sgst,
                igst,
                grand_total
              });
            });
          } else {
            callback(null, { quotationId: id, itemsUpdated: 0, sub_total, freight, cgst, sgst, igst, grand_total });
          }
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