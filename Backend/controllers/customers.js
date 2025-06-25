const Customer = require('../models/customers');

exports.getAll = (req, res) => {
  Customer.getAll((err, result) => {
    if (err) return res.status(500).json({ error: err });
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
