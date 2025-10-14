// controllers/paymentEntries.js
const PaymentEntry = require('../models/paymentEntries');

exports.getAll = (req, res) => {
  PaymentEntry.getAll((err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
};


exports.getOne = (req, res) => {
  const id = req.params.id;
  PaymentEntry.getById(id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!result) return res.status(404).json({ message: 'Payment entry not found' });
    res.json(result);
  });
};

exports.getByInvoice = (req, res) => {
  const invoiceId = req.params.invoiceId;
  PaymentEntry.getByInvoiceId(invoiceId, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
};

exports.create = (req, res) => {
  const paymentData = req.body;
  
  // Validate required fields
  if (!paymentData.invoice_id || !paymentData.invoice_number || !paymentData.payment_date || !paymentData.amount) {
    return res.status(400).json({ 
      error: 'Missing required fields: invoice_id, invoice_number, payment_date, amount' 
    });
  }

  // Set defaults
  paymentData.payment_mode = paymentData.payment_mode || 'Cash';
  paymentData.currency = paymentData.currency || 'INR';

  PaymentEntry.create(paymentData, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ 
      message: 'Payment entry created successfully', 
      paymentId: result.insertId,
      remainingBalance: result.remainingBalance,
      invoiceTotal: result.invoiceTotal
    });
  });
};

exports.update = (req, res) => {
  const id = req.params.id;
  const paymentData = req.body;
  
  PaymentEntry.update(id, paymentData, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Payment entry not found' });
    }
    res.json({ message: 'Payment entry updated successfully' });
  });
};

exports.remove = (req, res) => {
  const id = req.params.id;
  PaymentEntry.remove(id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Payment entry not found' });
    }
    res.json({ message: 'Payment entry deleted successfully' });
  });
};

module.exports = exports;