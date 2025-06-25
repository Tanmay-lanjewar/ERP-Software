const Tax = require('../models/taxes');

exports.getAll = (req, res) => {
  Tax.getAll((err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result);
  });
};

exports.create = (req, res) => {
  Tax.create(req.body, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ message: 'Tax created', id: result.insertId });
  });
};

exports.update = (req, res) => {
  Tax.update(req.params.id, req.body, (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Tax updated' });
  });
};

exports.remove = (req, res) => {
  Tax.remove(req.params.id, (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Tax deleted' });
  });
};
