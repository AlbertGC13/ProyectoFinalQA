const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('mi_db', 'postgres', 'admin', {
  host: 'localhost',
  dialect: 'postgres'
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('./user')(sequelize, Sequelize.DataTypes);
db.Product = require('./product')(sequelize, Sequelize.DataTypes);

module.exports = db;
