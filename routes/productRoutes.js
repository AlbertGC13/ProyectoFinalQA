const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { isAdmin } = require('../middleware/authMiddleware');

router.post('/', isAdmin, productController.createProduct);
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getOneProduct);
router.put('/:id', isAdmin, productController.updateProduct);
router.delete('/:id', isAdmin, productController.deleteProduct);

module.exports = router;
