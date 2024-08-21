const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  // Hook para hashear la contraseña antes de crear un usuario
  // User.beforeCreate(async (user, options) => {
  //   const salt = await bcrypt.genSalt(10);
  //   user.password = await bcrypt.hash(user.password, salt);
  // });

  // Hook para hashear la contraseña antes de actualizar un usuario
  // User.beforeUpdate(async (user, options) => {
  //   if (user.changed('password')) {
  //     const salt = await bcrypt.genSalt(10);
  //     user.password = await bcrypt.hash(user.password, salt);
  //   }
  // });

  return User;
};
