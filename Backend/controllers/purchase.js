const PurchaseOrder = require('../models/purchase');

// Get all
exports.getAllPurchaseOrders = (req, res) => {
  PurchaseOrder.getAll((err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// Get one
exports.getPurchaseOrderById = (req, res) => {
  const id = req.params.id;
  PurchaseOrder.getById(id, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// Create
exports.createPurchaseOrder = (req, res) => {
  PurchaseOrder.create(req.body, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Purchase order created', results });
  });
};

// Update
exports.updatePurchaseOrder = (req, res) => {
  const id = req.params.id;
  PurchaseOrder.update(id, req.body, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Purchase order updated' });
  });
};
