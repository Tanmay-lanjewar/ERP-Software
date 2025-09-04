const WorkOrder = require('../models/workorders');

exports.create = (req, res) => {
  WorkOrder.create(req.body, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ message: 'Work order created', id: result.insertId });
  });
};

exports.getAll = (req, res) => {
  WorkOrder.getAll((err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result);
  });
};

exports.getById = (req, res) => {
  WorkOrder.getById(req.params.id, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result[0]);
  });
};

exports.update = (req, res) => {
  WorkOrder.update(req.params.id, req.body, (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Work order updated' });
  });
};

exports.remove = (req, res) => {
  WorkOrder.remove(req.params.id, (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Work order deleted' });
  });
};


