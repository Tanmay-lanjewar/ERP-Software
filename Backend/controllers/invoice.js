const invoice = require('../models/invoice');
const Customer = require('../models/customers');
const db = require('../config/db');

exports.getAll = (req, res) => {
  invoice.getAll((err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result);
  });
};

exports.getOne = (req, res) => {
  const id = req.params.id;
  invoice.getById(id, (err, invoiceData) => {
    if (err) return res.status(500).json({ error: err });
    if (!invoiceData) return res.status(404).json({ message: 'Invoice not found' });
    invoice.getItemsByInvoiceId(id, (itemErr, items) => {
      if (itemErr) return res.status(500).json({ error: itemErr });
      Customer.getById(invoiceData.customer_id, (custErr, customer) => {
        if (custErr) return res.status(500).json({ error: custErr });
        if (!customer) return res.status(404).json({ message: 'Customer not found' });
        const sub_total = items.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
        const cgst = parseFloat((sub_total * 0.09).toFixed(2));
        const sgst = parseFloat((sub_total * 0.09).toFixed(2));
        const grand_total = parseFloat((sub_total + cgst + sgst).toFixed(2));
        res.json({
          invoice: invoiceData,
          items,
          customer,
          sub_total,
          cgst,
          sgst,
          grand_total
        });
      });
    });
  });
};

exports.create = (req, res) => {
  const { invoice: invoiceData, items = [] } = req.body;
  if (!invoiceData || typeof invoiceData !== 'object' || !invoiceData.customer_id || !invoiceData.customer_name) {
    return res.status(400).json({ error: "Missing or invalid invoice data (customer_id and customer_name required)" });
  }
  if (!invoiceData.status) {
    invoiceData.status = 'Draft';
  }
  invoice.create(invoiceData, items, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({
      message: 'Invoice created successfully',
      invoiceId: result.invoiceId,
      invoiceNumber: result.invoiceNumber,
      itemsInserted: result.itemsInserted,
      sub_total: result.sub_total,
      cgst: result.cgst,
      sgst: result.sgst,
      grand_total: result.grand_total
    });
  });
};

exports.remove = (req, res) => {
  invoice.remove(req.params.id, (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Invoice and related items deleted successfully' });
  });
};

exports.update = (req, res) => {
  const id = req.params.id;
  const data = req.body;
  const fields = [
    'customer_id',
    'customer_name',
    'invoice_date',
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
  const sql = `UPDATE invoice SET ${updates.join(', ')} WHERE invoice_id = ?`;
  values.push(id);
  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Invoice updated successfully' });
  });
};