const Vendor = require('../models/vendors');

exports.getAll = (req, res) => {
  Vendor.getAll((err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result);
  });
};

exports.create = (req, res) => {
  Vendor.create(req.body, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ message: 'Vendor created', id: result.insertId });
  });
};

exports.update = (req, res) => {
  Vendor.update(req.params.id, req.body, (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Vendor updated' });
  });
};

exports.remove = (req, res) => {
  Vendor.remove(req.params.id, (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Vendor deleted' });
  });
};
