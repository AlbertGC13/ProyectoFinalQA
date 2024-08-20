require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Esto es necesario para conexiones SSL en Railway
    },
  },
});

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
