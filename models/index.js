require('dotenv').config();
const { Sequelize } = require('sequelize');

let sequelize;

if (process.env.NODE_ENV === 'production') {
  // Configuración para producción
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // Necesario para conexiones SSL en Railway
      },
    },
  });
} else {
  // Configuración para desarrollo local
  sequelize = new Sequelize(process.env.POSTGRES_DB, process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, {
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT || 5432,
    dialect: 'postgres',
  });
}

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('./user')(sequelize, Sequelize.DataTypes);
db.Product = require('./product')(sequelize, Sequelize.DataTypes);
db.StockMovement = require('./stockMovement')(sequelize, Sequelize.DataTypes);

// Establecemos las relaciones entre los modelos
db.Product.hasMany(db.StockMovement, { foreignKey: 'productId' });
db.StockMovement.belongsTo(db.Product, { foreignKey: 'productId' });

db.User.hasMany(db.StockMovement, { foreignKey: 'userId' });
db.StockMovement.belongsTo(db.User, { foreignKey: 'userId' });

module.exports = db;
