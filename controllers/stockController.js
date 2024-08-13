const db = require('../models');

exports.updateStock = async (req, res) => {
  const { id } = req.params;
  const { quantity, type } = req.body; // `type` puede ser 'entrada' o 'salida'

  try {
    const product = await db.Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (type === 'salida' && product.stock <= 0) {
      return res.status(400).json({ error: 'No se puede realizar una salida porque el stock es 0 o negativo.' });
    }

    // Actualizar el stock dependiendo del tipo de movimiento
    if (type === 'entrada') {
      product.stock += quantity;
    } else if (type === 'salida') {
      if (product.stock - quantity < 0) {
        return res.status(400).json({ error: 'No se puede realizar una salida que deje el stock en negativo.' });
      }
      product.stock -= quantity;

      // Verificar si el stock cae por debajo del mínimo
      if (product.stock < product.min_stock) {
        console.log(`Alerta: El stock del producto ${product.name} ha caído por debajo del mínimo.`);
      }
    } else {
      return res.status(400).json({ error: 'Invalid movement type' });
    }

    await product.save();

    // Registrar el movimiento en el historial
    await db.StockMovement.create({
      productId: id,
      quantity,
      type,
      userId: req.user.id,
    });

    res.status(200).json({ message: 'Stock updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getAllStockMovements = async (req, res) => {
  try {
    const stockMovements = await db.StockMovement.findAll({
      include: [
        {
          model: db.Product,
          attributes: ['name', 'category'] // Incluir atributos relevantes del producto
        },
        {
          model: db.User,
          attributes: ['username'] // Incluir atributos relevantes del usuario
        }
      ]
    });
    res.status(200).json(stockMovements);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getStockMovement = async (req, res) => {
  const { id } = req.params;

  try {
    const movement = await db.StockMovement.findOne({ where: { id } });
    if (movement) {
      res.status(200).json(movement);
    } else {
      res.status(404).json({ error: 'Stock movement not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteStockMovement = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await db.StockMovement.destroy({ where: { id } });
    if (deleted) {
      res.status(200).json({ message: 'Stock movement deleted successfully' });
    } else {
      res.status(404).json({ error: 'Stock movement not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
