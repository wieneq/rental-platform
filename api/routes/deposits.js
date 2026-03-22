const express = require('express');
const router = express.Router();
const depositController = require('../controllers/depositController');
const { isAuthenticated } = require('../middleware/auth');
const { hasRole } = require('../middleware/roles');

router.get('/', isAuthenticated, depositController.getAll);
router.put('/:id/refund', isAuthenticated, hasRole(['admin']), depositController.refund);
router.put('/:id/deduct', isAuthenticated, hasRole(['admin']), depositController.deduct);

module.exports = router;
