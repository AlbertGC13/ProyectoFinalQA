'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Products', 'quantity');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn('Products', 'quantity', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });
  }
};
