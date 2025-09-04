const Vendor = require('../models/vendors');

exports.getAll = (req, res) => {
  Vendor.getAll((err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

exports.getById = (req, res) => {
  const id = req.params.id;
  Vendor.getById(id, (err, vendor) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!vendor) return res.status(404).json({ error: 'Vendor not found' });
    res.json(vendor);
  });
};

exports.getByName = (req, res) => {
  const { name } = req.query;
  if (!name) return res.status(400).json({ error: 'Vendor name is required' });
  Vendor.getByName(name, (err, vendor) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!vendor) return res.status(404).json({ error: 'Vendor not found' });
    res.json(vendor);
  });
};

exports.create = (req, res) => {
  Vendor.create(req.body, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ id: result.insertId });
  });
};

exports.update = (req, res) => {
  Vendor.update(req.params.id, req.body, (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ success: true });
  });
};

exports.remove = (req, res) => {
  Vendor.remove(req.params.id, (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ success: true });
  });
};

exports.updateStatus = (req, res) => {
  Vendor.updateStatus(req.params.id, req.body.status, (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ success: true });
  });
};