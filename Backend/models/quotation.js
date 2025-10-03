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

  getNextQuoteNumber: (callback) => {
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

          let nextSeq;
          if (counter.length === 0) {
            db.query('INSERT INTO counters (id, seq) VALUES (?, 1)', [counterId], (err) => {
              if (err) return db.query('ROLLBACK', () => callback(err));
              nextSeq = 1;
              db.query('COMMIT', (err) => {
                if (err) return callback(err);
                const quoteNumber = `ME/BESPL/${String(nextSeq).padStart(3, '0')}/${financialYear}`;
                callback(null, { nextQuoteNumber: quoteNumber });
              });
            });
          } else {
            nextSeq = counter[0].seq + 1;
            db.query('UPDATE counters SET seq = seq + 1 WHERE id = ?', [counterId], (err) => {
              if (err) return db.query('ROLLBACK', () => callback(err));
              db.query('COMMIT', (err) => {
                if (err) return callback(err);
                const quoteNumber = `ME/BESPL/${String(nextSeq).padStart(3, '0')}/${financialYear}`;
                callback(null, { nextQuoteNumber: quoteNumber });
              });
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

    const quotationSql = `
      UPDATE quotation SET
        customer_name = ?, quotation_date = ?, expiry_date = ?, subject = ?,
        customer_notes = ?, terms_and_conditions = ?,
        sub_total = ?, cgst = ?, sgst = ?, grand_total = ?, attachment_url = ?, status = ?
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
      cgst,
      sgst,
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
              quotation_id, item_detail, quantity, rate, discount, amount
            ) VALUES ?
          `;

          const itemValues = items.map(item => [
            id,
            item.item_detail,
            item.quantity,
            item.rate,
            item.discount,
            item.amount
          ]);

          db.query(itemSql, [itemValues], (itemErr, itemResult) => {
            if (itemErr) return callback(itemErr);
            callback(null, {
              quotationId: id,
              itemsUpdated: itemResult.affectedRows,
              sub_total,
              cgst,
              sgst,
              grand_total
            });
          });
        } else {
          callback(null, { quotationId: id, itemsUpdated: 0, sub_total, cgst, sgst, grand_total });
        }
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