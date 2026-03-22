const express = require('express');
const router = express.Router();
const repairController = require('../controllers/repairController');
const { isAuthenticated } = require('../middleware/auth');
const { hasRole } = require('../middleware/roles');

router.get('/', isAuthenticated, repairController.getAll);
router.post('/', isAuthenticated, repairController.create);
router.put('/:id', isAuthenticated, hasRole(['admin']), repairController.updateStatus);

module.exports = router;
