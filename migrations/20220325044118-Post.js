require('env');
const { User, Post } = require('database/models');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(Post.getTableName(), {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: Sequelize.STRING(100),
      text: Sequelize.TEXT,
      thumbnail: Sequelize.STRING,
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: User.getTableName(),
          key: 'id',
        },
      },
      createdAt: { type: Sequelize.DATE },
      updatedAt: { type: Sequelize.DATE },
    });
  },

  down: async queryInterface => {
    await queryInterface.dropTable(Post.getTableName());
  },
};
