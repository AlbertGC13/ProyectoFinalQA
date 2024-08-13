module.exports = (sequelize, DataTypes) => {
    const StockMovement = sequelize.define('StockMovement', {
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Products',
          key: 'id',
        }
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM('entrada', 'salida'),
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        }
      }
    });
  
    return StockMovement;
  };
  