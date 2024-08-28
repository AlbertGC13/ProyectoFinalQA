const { Sequelize } = require('sequelize');
const productController = require('../../controllers/productController');

jest.mock('../../models', () => {
  const SequelizeMock = require('sequelize-mock');
  const dbMock = new SequelizeMock();

  const ProductMock = dbMock.define('Product', {
    id: 1,
    name: 'Test Product',
    description: 'Test Description',
    category: 'Test Category',
    price: 100,
    stock: 10,
    min_stock: 5,
    is_deleted: false
  });

  ProductMock.findOne = jest.fn();
  ProductMock.destroy = jest.fn();
  ProductMock.update = jest.fn();
  ProductMock.findAll = jest.fn();

  const StockMovementMock = {
    count: jest.fn()
  };

  return {
    sequelize: dbMock,
    Sequelize: SequelizeMock,
    Product: ProductMock,
    StockMovement: StockMovementMock
  };
});

describe('Product Controller', () => {
  let Product;

  beforeEach(() => {
    jest.clearAllMocks();
    const models = require('../../models');
    Product = models.Product;
  });

  describe('getAllProducts', () => {
    it('should return all products', async () => {
      const products = [{ id: 1, name: 'Test Product' }];
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const { Product } = require('../../models');
      jest.spyOn(Product, 'findAll').mockResolvedValue(products);

      await productController.getAllProducts(req, res);

      expect(Product.findAll).toHaveBeenCalled();
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
      const { Product } = require('../../models');
      jest.spyOn(Product, 'findAll').mockRejectedValue(new Error(errorMessage));

      await productController.getAllProducts(req, res);

      expect(Product.findAll).toHaveBeenCalled();
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
      const { Product } = require('../../models');
      jest.spyOn(Product, 'findOne').mockResolvedValue(product);

      await productController.getOneProduct(req, res);

      expect(Product.findOne).toHaveBeenCalledWith({ where: { id: 1, is_deleted: false } });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(product);
    });

    it('should return 404 if product not found', async () => {
      const req = { params: { id: 1 } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const { Product } = require('../../models');
      jest.spyOn(Product, 'findOne').mockResolvedValue(null);

      await productController.getOneProduct(req, res);

      expect(Product.findOne).toHaveBeenCalledWith({ where: { id: 1, is_deleted: false } });
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
      const { Product } = require('../../models');
      jest.spyOn(Product, 'findOne').mockRejectedValue(new Error(errorMessage));

      await productController.getOneProduct(req, res);

      expect(Product.findOne).toHaveBeenCalledWith({ where: { id: 1, is_deleted: false } });
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
      const { Product } = require('../../models');
      jest.spyOn(Product, 'update').mockResolvedValue([1]);
      jest.spyOn(Product, 'findOne').mockResolvedValue(product);

      await productController.updateProduct(req, res);

      expect(Product.update).toHaveBeenCalledWith(req.body, { where: { id: 1, is_deleted: false } });
      expect(Product.findOne).toHaveBeenCalledWith({ where: { id: 1 } }); // Removido is_deleted
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(product);
    });

    it('should return 404 if product not found', async () => {
      const req = { params: { id: 1 }, body: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const { Product } = require('../../models');
      jest.spyOn(Product, 'update').mockResolvedValue([0]);

      await productController.updateProduct(req, res);

      expect(Product.update).toHaveBeenCalledWith(req.body, { where: { id: 1, is_deleted: false } });
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
      const { Product } = require('../../models');
      jest.spyOn(Product, 'update').mockRejectedValue(new Error(errorMessage));

      await productController.updateProduct(req, res);

      expect(Product.update).toHaveBeenCalledWith(req.body, { where: { id: 1, is_deleted: false } });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

  describe('deleteProduct', () => {
    it('should mark a product as deleted if it has stock movements', async () => {
      const req = { params: { id: 1 } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
  
      const mockProduct = { id: 1, is_deleted: false };
      Product.findOne.mockResolvedValue(mockProduct);
      Product.update.mockResolvedValue([1]);
      const StockMovement = require('../../models').StockMovement;
      StockMovement.count = jest.fn().mockResolvedValue(1);
  
      await productController.deleteProduct(req, res);
  
      expect(Product.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(StockMovement.count).toHaveBeenCalledWith({ where: { productId: 1 } });
      expect(Product.update).toHaveBeenCalledWith(
        { is_deleted: true },
        { where: { id: 1 } }
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Product marked as deleted" });
    });
  
    it('should delete a product if it has no stock movements', async () => {
      const req = { params: { id: 1 } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
  
      const mockProduct = { id: 1, is_deleted: false };
      Product.findOne.mockResolvedValue(mockProduct);
      Product.destroy.mockResolvedValue(1);
      const StockMovement = require('../../models').StockMovement;
      StockMovement.count = jest.fn().mockResolvedValue(0);
  
      await productController.deleteProduct(req, res);
  
      expect(Product.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(StockMovement.count).toHaveBeenCalledWith({ where: { productId: 1 } });
      expect(Product.destroy).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Product deleted successfully" });
    });
  

    it('should return 404 if product not found', async () => {
      const req = { params: { id: 1 } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      Product.findOne.mockResolvedValue(null);

      await productController.deleteProduct(req, res);

      expect(Product.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
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
      Product.findOne.mockRejectedValue(new Error(errorMessage));

      await productController.deleteProduct(req, res);

      expect(Product.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });

    it('should return 404 if product not found', async () => {
      const req = { params: { id: 1 } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const { Product } = require('../../models');
      jest.spyOn(Product, 'findOne').mockResolvedValue(null);

      await productController.deleteProduct(req, res);

      expect(Product.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
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
      const { Product } = require('../../models');
      jest.spyOn(Product, 'findOne').mockRejectedValue(new Error(errorMessage));

      await productController.deleteProduct(req, res);

      expect(Product.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });
});