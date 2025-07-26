const express = require('express');
const router = express.Router();
const workordersController = require('../controllers/workorders');

// Get all workorders
router.get('/workorders', (req, res) => {
  workordersController.getAllWorkOrders((err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch workorders' });
    }
    res.json(results);
  });
});

// Create a new workorder
router.post('/workorders', (req, res) => {
  workordersController.createWorkOrder(req.body, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to create workorder' });
    }
    res.status(201).json({ message: 'Workorder created successfully', id: results.insertId });
  });
});

// Update an existing workorder
router.put('/workorders/:id', (req, res) => {
  const id = req.params.id;
  workordersController.updateWorkOrder(id, req.body, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to update workorder' });
    }
    res.json({ message: 'Workorder updated successfully' });
  });
});

// Delete a workorder
router.delete('/workorders/:id', (req, res) => {
  const id = req.params.id;
  workordersController.deleteWorkOrder(id, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete workorder' });
    }
    res.json({ message: 'Workorder deleted successfully' });
  });
});

// Update status of a workorder
router.patch('/workorders/:id/status', (req, res) => {
  const id = req.params.id;
  const { status } = req.body;
  workordersController.updateWorkOrderStatus(id, status, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to update workorder status' });
    }
    res.json({ message: 'Workorder status updated successfully' });
  });
});

module.exports = router;
