require('env');
const { User } = require('database/models');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(User.getTableName(), {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        type: Sequelize.STRING,
        unique: true,
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
      },
      createdAt: { type: Sequelize.DATE },
      updatedAt: { type: Sequelize.DATE },
    });
  },

  down: async queryInterface => {
    await queryInterface.dropTable(User.getTableName());
  },
};
