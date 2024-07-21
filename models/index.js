const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('gestion-inventario', 'postgres', '123456', {
  host: 'localhost',
  dialect: 'postgres',
  port: '5434',
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('./user')(sequelize, Sequelize.DataTypes);
db.Product = require('./product')(sequelize, Sequelize.DataTypes);

module.exports = db;
