const express = require('express');
const router = express.Router();
const controller = require('../controllers/vendors');

router.get('/', controller.getAll);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);
// In routes/vendors.js
router.get('/:id', controller.getById);
router.patch('/:id/status', controller.updateStatus);

module.exports = router;
