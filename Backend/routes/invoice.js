const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoice.js');

router.get('/', invoiceController.getAll);
router.get('/:id', invoiceController.getOne);
router.post('/', invoiceController.create);
router.delete('/:id', invoiceController.remove);
router.put('/:id', invoiceController.update);

module.exports = router; 