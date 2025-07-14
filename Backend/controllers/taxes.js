const Tax = require('../models/taxes');

exports.getAll = (req, res) => {
  Tax.getAll((err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result);
  });
};

exports.create = (req, res) => {
  const { tax_name, tax_rate, tax_code, details, status, effective_date } = req.body;

  if (!tax_name || !tax_rate || !tax_code || !status || !effective_date) {
    return res.status(400).json({ error: 'Required fields missing' });
  }

  Tax.create(req.body, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ message: 'Tax created', id: result.insertId });
  });
};

exports.update = (req, res) => {
  Tax.update(req.params.id, req.body, (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Updated successfully' });
  });
};

exports.remove = (req, res) => {
  Tax.remove(req.params.id, (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Tax deleted' });
  });
};

exports.updateStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  Tax.updateStatus(id, status, (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Status updated' });
  });
};
exports.getOne = (req, res) => {
  Tax.getById(req.params.id, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result[0]);
  });
};

exports.update = (req, res) => {
  Tax.update(req.params.id, req.body, (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Updated successfully' });
  });
};
