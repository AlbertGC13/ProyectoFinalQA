const db = require('../models');

exports.createProduct = async (req, res) => {
  try {
    const product = await db.Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await db.Product.findAll({
      where: { is_deleted: false } // Filtrar productos eliminados lógicamente
    });
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getOneProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await db.Product.findOne({
      where: { id, is_deleted: false } // Filtrar productos eliminados lógicamente
    });
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await db.Product.update(req.body, { where: { id, is_deleted: false } });
    if (updated) {
      const updatedProduct = await db.Product.findOne({ where: { id } });
      res.status(200).json(updatedProduct);
    } else {
      throw new Error('Product not found');
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar el producto para verificar su estado
    const product = await db.Product.findOne({ where: { id } });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (product.is_deleted) {
      return res.status(400).json({ message: "Product is already marked as deleted" });
    }

    // Contar movimientos de stock asociados al producto
    const stockMovementsCount = await db.StockMovement.count({ where: { productId: id } });

    if (stockMovementsCount > 0) {
      // Si hay movimientos de stock, realizar soft delete
      await db.Product.update({ is_deleted: true }, { where: { id } });
      res.status(200).json({ message: "Product marked as deleted" });
    } else {
      // Si no hay movimientos de stock, realizar hard delete
      const deleted = await db.Product.destroy({ where: { id } });
      if (deleted) {
        res.status(200).json({ message: "Product deleted successfully" });
      } else {
        res.status(404).json({ error: "Product not found" });
      }
    }
  } catch (error) {
    // Manejo de errores de integridad referencial
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      res.status(400).json({ error: 'Cannot delete product because there are dependent stock movements.' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

