const quotation = require('../models/quotation');

// Get all quotations
exports.getAll = (req, res) => {
  quotation.getAll((err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result);
  });
};

// Get single quotation by ID with its items
exports.getOne = (req, res) => {
  const id = req.params.id;

  quotation.getById(id, (err, quotationData) => {
    if (err) return res.status(500).json({ error: err });
    if (!quotationData) return res.status(404).json({ message: 'Quotation not found' });

    quotation.getItemsByQuotationId(id, (itemErr, items) => {
      if (itemErr) return res.status(500).json({ error: itemErr });

      const sub_total = items.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
      const cgst = parseFloat((sub_total * 0.09).toFixed(2));
      const sgst = parseFloat((sub_total * 0.09).toFixed(2));
      const grand_total = parseFloat((sub_total + cgst + sgst).toFixed(2));

      res.json({
        quotation: quotationData,
        items,
        sub_total,
        cgst,
        sgst,
        grand_total
      });
    });
  });
};

// Create new quotation with items
exports.create = (req, res) => {
  const { quotation: quotationData, items = [] } = req.body;

  if (!quotationData || typeof quotationData !== 'object' || !quotationData.customer_name) {
    return res.status(400).json({ error: "Missing or invalid quotation data (customer_name required)" });
  }

  // Accept status from frontend, default to 'Draft'
  if (!quotationData.status) {
    quotationData.status = 'Draft';
  }

  quotation.create(quotationData, items, (err, result) => {
    if (err) return res.status(500).json({ error: err });

    res.status(201).json({
      message: 'Quotation created successfully',
      quotationId: result.quotationId,
      quoteNumber: result.quoteNumber,
      itemsInserted: result.itemsInserted,
      sub_total: result.sub_total,
      cgst: result.cgst,
      sgst: result.sgst,
      grand_total: result.grand_total
    });
  });
};

// Delete quotation and its items
exports.remove = (req, res) => {
  quotation.remove(req.params.id, (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Quotation and related items deleted successfully' });
  });
};

// Add items to an existing quotation and update totals
exports.addItems = (req, res) => {
  const quotationId = req.params.id;
  const items = req.body.items;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'No items provided to add' });
  }

  const itemValues = items.map(item => {
    item.amount = parseFloat((item.quantity * item.rate - (item.discount || 0)).toFixed(2));
    return [
      quotationId,
      item.item_detail,
      item.quantity,
      item.rate,
      item.discount,
      item.amount
    ];
  });

  const itemSql = `
    INSERT INTO quotation_items (
      quotation_id, item_detail, quantity, rate, discount, amount
    ) VALUES ?
  `;

  const db = require('../config/db');
  db.query(itemSql, [itemValues], (err, result) => {
    if (err) return res.status(500).json({ error: err });

    // Recalculate updated totals
    quotation.getItemsByQuotationId(quotationId, (itemErr, allItems) => {
      if (itemErr) return res.status(500).json({ error: itemErr });

      const sub_total = allItems.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
      const cgst = parseFloat((sub_total * 0.09).toFixed(2));
      const sgst = parseFloat((sub_total * 0.09).toFixed(2));
      const grand_total = parseFloat((sub_total + cgst + sgst).toFixed(2));

      const updateSql = `
        UPDATE quotation
        SET sub_total = ?, cgst = ?, sgst = ?, grand_total = ?
        WHERE quotation_id = ?
      `;

      db.query(updateSql, [sub_total, cgst, sgst, grand_total, quotationId], (updateErr) => {
        if (updateErr) return res.status(500).json({ error: updateErr });

        res.json({
          message: 'Items added and quotation updated successfully',
          quotationId,
          addedItems: result.affectedRows,
          sub_total,
          cgst,
          sgst,
          grand_total
        });
      });
    });
  });
};

// Update a quotation by ID
exports.update = (req, res) => {
  const id = req.params.id;
  const data = req.body;
  const fields = [
    'customer_name',
    'quotation_date',
    'expiry_date',
    'subject',
    'customer_notes',
    'terms_and_conditions',
    'status'
  ];
  const updates = [];
  const values = [];
  fields.forEach(field => {
    if (data[field] !== undefined) {
      updates.push(`${field} = ?`);
      values.push(data[field]);
    }
  });
  if (updates.length === 0) {
    return res.status(400).json({ error: 'No valid fields to update' });
  }
  const sql = `UPDATE quotation SET ${updates.join(', ')} WHERE quotation_id = ?`;
  values.push(id);
  const db = require('../config/db');
  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Quotation updated successfully' });
  });
};

// Get next quotation number
exports.getNextQuoteNumber = (req, res) => {
  quotation.getNextQuoteNumber((err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
};