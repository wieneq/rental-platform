const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { isAuthenticated } = require('../middleware/auth');

router.get('/', isAuthenticated, bookingController.getAll);
router.post('/check-availability', bookingController.checkAvailability);
router.post('/', isAuthenticated, bookingController.create);
router.put('/:id/status', isAuthenticated, bookingController.updateStatus);

module.exports = router;
