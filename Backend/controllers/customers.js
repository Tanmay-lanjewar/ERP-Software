const Customer = require('../models/customers');

exports.getAll = (req, res) => {
  Customer.getAll((err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result);
  });
};

exports.getById = (req, res) => {
  Customer.getById(req.params.id, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (!result) return res.status(404).json({ message: 'Customer not found' });
    res.json(result);
  });
};

exports.create = (req, res) => {
  Customer.create(req.body, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ message: 'Customer added', id: result.insertId });
  });
};

exports.update = (req, res) => {
  Customer.update(req.params.id, req.body, (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Customer updated' });
  });
};

exports.remove = (req, res) => {
  Customer.remove(req.params.id, (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Customer deleted' });
  });
};

exports.updateStatus = (req, res) => {
  const { status } = req.body;
  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }
  Customer.updateStatus(req.params.id, status, (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Customer status updated' });
  });
};