const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');
const { isAdmin, isEmployee, isAuthenticated } = require('../middleware/authMiddleware');

// Ruta para actualizar el stock
router.put('/update-stock/:id', isEmployee, stockController.updateStock);
router.get('/', isAuthenticated, stockController.getAllStockMovements);
router.get('/:id', isAuthenticated, stockController.getStockMovement);
// Ruta para eliminar un movimiento de stock (opcional)
router.delete('/:id', isEmployee, stockController.deleteStockMovement);

module.exports = router;
