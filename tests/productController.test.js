const db = require('../models');
const productController = require('../controllers/productController');

// Mock de la base de datos
jest.mock('../models');

describe('Product Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createProduct', () => {
    it('should create a product', async () => {
      const req = { body: { name: 'Test Product', description: 'Test Description', category: 'Test Category', price: 100, quantity: 10 } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      db.Product.create.mockResolvedValue(req.body);

      await productController.createProduct(req, res);

      expect(db.Product.create).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(req.body);
    });

    it('should handle errors', async () => {
      const req = { body: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const errorMessage = 'Validation error';
      db.Product.create.mockRejectedValue(new Error(errorMessage));

      await productController.createProduct(req, res);

      expect(db.Product.create).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

  describe('getAllProducts', () => {
    it('should return all products', async () => {
      const products = [{ id: 1, name: 'Test Product' }];
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      db.Product.findAll.mockResolvedValue(products);

      await productController.getAllProducts(req, res);

      expect(db.Product.findAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(products);
    });

    it('should handle errors', async () => {
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const errorMessage = 'Database error';
      db.Product.findAll.mockRejectedValue(new Error(errorMessage));

      await productController.getAllProducts(req, res);

      expect(db.Product.findAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

  describe('getOneProduct', () => {
    it('should return one product', async () => {
      const product = { id: 1, name: 'Test Product' };
      const req = { params: { id: 1 } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      db.Product.findOne.mockResolvedValue(product);

      await productController.getOneProduct(req, res);

      expect(db.Product.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(product);
    });

    it('should return 404 if product not found', async () => {
      const req = { params: { id: 1 } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      db.Product.findOne.mockResolvedValue(null);

      await productController.getOneProduct(req, res);

      expect(db.Product.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Product not found' });
    });

    it('should handle errors', async () => {
      const req = { params: { id: 1 } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const errorMessage = 'Database error';
      db.Product.findOne.mockRejectedValue(new Error(errorMessage));

      await productController.getOneProduct(req, res);

      expect(db.Product.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

  describe('updateProduct', () => {
    it('should update a product', async () => {
      const product = { id: 1, name: 'Updated Product' };
      const req = { params: { id: 1 }, body: product };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      db.Product.update.mockResolvedValue([1]);
      db.Product.findOne.mockResolvedValue(product);

      await productController.updateProduct(req, res);

      expect(db.Product.update).toHaveBeenCalledWith(req.body, { where: { id: 1 } });
      expect(db.Product.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(product);
    });

    it('should return 404 if product not found', async () => {
      const req = { params: { id: 1 }, body: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      db.Product.update.mockResolvedValue([0]);

      await productController.updateProduct(req, res);

      expect(db.Product.update).toHaveBeenCalledWith(req.body, { where: { id: 1 } });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Product not found' });
    });

    it('should handle errors', async () => {
      const req = { params: { id: 1 }, body: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const errorMessage = 'Database error';
      db.Product.update.mockRejectedValue(new Error(errorMessage));

      await productController.updateProduct(req, res);

      expect(db.Product.update).toHaveBeenCalledWith(req.body, { where: { id: 1 } });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product', async () => {
      const req = { params: { id: 1 } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      db.Product.destroy.mockResolvedValue(1);

      await productController.deleteProduct(req, res);

      expect(db.Product.destroy).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith("Product deleted successfully");
    });

    it('should return 404 if product not found', async () => {
      const req = { params: { id: 1 } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      db.Product.destroy.mockResolvedValue(0);

      await productController.deleteProduct(req, res);

      expect(db.Product.destroy).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Product not found' });
    });

    it('should handle errors', async () => {
      const req = { params: { id: 1 } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const errorMessage = 'Database error';
      db.Product.destroy.mockRejectedValue(new Error(errorMessage));

      await productController.deleteProduct(req, res);

      expect(db.Product.destroy).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });
});
