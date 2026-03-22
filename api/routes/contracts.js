const express = require('express');
const router = express.Router();
const contractController = require('../controllers/contractController');
const { isAuthenticated } = require('../middleware/auth');

router.post('/sign', isAuthenticated, contractController.sign);
router.get('/', isAuthenticated, contractController.getAll);
router.get('/:id', isAuthenticated, contractController.getById);
router.get('/:id/download', isAuthenticated, contractController.downloadPDF);

module.exports = router;
