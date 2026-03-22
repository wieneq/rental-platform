const express = require('express');
const router = express.Router();
const equipmentController = require('../controllers/equipmentController');
const { isAuthenticated } = require('../middleware/auth');
const { hasRole } = require('../middleware/roles');

router.get('/', equipmentController.getAll);
router.get('/:id', equipmentController.getById);
router.post('/', isAuthenticated, hasRole(['owner', 'admin']), equipmentController.create);
router.put('/:id', isAuthenticated, equipmentController.update);
router.delete('/:id', isAuthenticated, equipmentController.delete);

module.exports = router;
