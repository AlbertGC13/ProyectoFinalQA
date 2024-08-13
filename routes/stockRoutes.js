const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');
const { isAdmin } = require('../middleware/authMiddleware');

// Ruta para actualizar el stock
router.put('/update-stock/:id', isAdmin, stockController.updateStock);
router.get('/', isAdmin, stockController.getAllStockMovements);
router.get('/:id', isAdmin, stockController.getStockMovement);
// Ruta para eliminar un movimiento de stock (opcional)
router.delete('/:id', isAdmin, stockController.deleteStockMovement);

module.exports = router;
