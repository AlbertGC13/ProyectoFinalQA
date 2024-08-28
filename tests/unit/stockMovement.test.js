const { DataTypes } = require('sequelize');
const { sequelize } = require('../../models');
const StockMovementModel = require('../../models/stockMovement');

describe('StockMovement Model', () => {
  let StockMovement;

  beforeAll(() => {
    StockMovement = StockMovementModel(sequelize, DataTypes);
  });

  it('debería definir el modelo StockMovement correctamente', () => {
    expect(StockMovement).toBeDefined();
  });

  it('debería tener los atributos correctos', () => {
    const attributes = StockMovement.rawAttributes;
    
    expect(attributes).toHaveProperty('productId');
    expect(attributes).toHaveProperty('quantity');
    expect(attributes).toHaveProperty('type');
    expect(attributes).toHaveProperty('userId');
  });

  it('debería tener el atributo productId con las propiedades correctas', () => {
    const productIdAttr = StockMovement.rawAttributes.productId;
    
    expect(productIdAttr.type instanceof DataTypes.INTEGER).toBeTruthy();
    expect(productIdAttr.allowNull).toBe(false);
    expect(productIdAttr.references).toEqual({
      model: 'Products',
      key: 'id',
    });
  });

  it('debería tener el atributo quantity con las propiedades correctas', () => {
    const quantityAttr = StockMovement.rawAttributes.quantity;
    
    expect(quantityAttr.type instanceof DataTypes.INTEGER).toBeTruthy();
    expect(quantityAttr.allowNull).toBe(false);
  });

  it('debería tener el atributo type con las propiedades correctas', () => {
    const typeAttr = StockMovement.rawAttributes.type;
    
    expect(typeAttr.type instanceof DataTypes.ENUM).toBeTruthy();
    expect(typeAttr.values).toEqual(['entrada', 'salida']);
    expect(typeAttr.allowNull).toBe(false);
  });

  it('debería tener el atributo userId con las propiedades correctas', () => {
    const userIdAttr = StockMovement.rawAttributes.userId;
    
    expect(userIdAttr.type instanceof DataTypes.INTEGER).toBeTruthy();
    expect(userIdAttr.allowNull).toBe(false);
    expect(userIdAttr.references).toEqual({
      model: 'Users',
      key: 'id',
    });
  });
});