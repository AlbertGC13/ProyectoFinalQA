const request = require('supertest');
const bcrypt = require('bcryptjs');
const app = require('../../app');

// Mocks
jest.mock('../../models', () => {
  const SequelizeMock = require('sequelize-mock');
  const dbMock = new SequelizeMock();

  const UserMock = dbMock.define('User', {
    id: 1,
    username: 'testuser',
    password: 'hashedpassword',
    role: 'admin'
  });

  UserMock.findOne = jest.fn();
  UserMock.findByPk = jest.fn();

  const ProductMock = dbMock.define('Product', {
    name: 'TestProduct',
    description: 'Test Description',
    category: 'Test Category',
    price: 10,
    stock: 100,
    min_stock: 10,
    is_deleted: false
  });

  ProductMock.findAll = jest.fn();
  ProductMock.create = jest.fn();

  return {
    sequelize: {
      sync: jest.fn().mockResolvedValue()
    },
    Sequelize: {
      Op: {
        like: Symbol('like')
      }
    },
    User: UserMock,
    Product: ProductMock
  };
});

const db = require('../../models');

describe('Pruebas de Integración Exitosas', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Autenticación requerida para rutas protegidas', async () => {
    const response = await request(app)
      .post('/products')
      .send({ name: 'Producto de prueba' })
      .expect(403); // Verificar que se niegue el acceso sin autenticación.

    expect(response.body).toHaveProperty('error', 'Access denied');
  });

  afterAll(async () => {
    jest.restoreAllMocks();
  });
});
