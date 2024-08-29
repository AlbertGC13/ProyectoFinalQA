const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { isAdmin, isEmployee, isAuthenticated } = require('../middleware/authMiddleware');

router.post('/', isEmployee, productController.createProduct);
router.get('/', isAuthenticated, productController.getAllProducts);
router.get('/:id', isAuthenticated, productController.getOneProduct);
router.put('/:id', isEmployee, productController.updateProduct);
router.delete('/:id', isAdmin, productController.deleteProduct);

module.exports = router;
