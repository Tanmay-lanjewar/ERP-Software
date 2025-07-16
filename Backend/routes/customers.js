const express = require('express');
const router = express.Router();
const controller = require('../controllers/customers');

router.get('/', controller.getAll);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);

// ✅ New route to update only status
router.patch('/:id/status', controller.updateStatus);

module.exports = router;
