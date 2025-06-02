const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.post('/', cartController.addItem);
router.get('/', cartController.getItems);
router.delete('/:id', cartController.removeItem);
router.put('/:id', cartController.updateItem);

module.exports = router;