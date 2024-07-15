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
    const products = await db.Product.findAll();
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getOneProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await db.Product.findOne({ where: { id } });
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
    const [updated] = await db.Product.update(req.body, { where: { id } });
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
    const deleted = await db.Product.destroy({ where: { id } });
    if (deleted) {
      res.status(200).json("Product deleted successfully");
    } else {
      throw new Error('Product not found');
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
