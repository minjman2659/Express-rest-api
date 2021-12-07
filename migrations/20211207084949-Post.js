module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('posts', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: Sequelize.STRING(100),
      text: Sequelize.TEXT,
      thumbnail: Sequelize.STRING,
      fkUserId: { type: Sequelize.INTEGER, field: 'fk_user_id' },
      createdAt: { type: Sequelize.DATE, field: 'created_at' },
      updatedAt: { type: Sequelize.DATE, field: 'updated_at' },
    });
  },

  down: async queryInterface => {
    await queryInterface.dropTable('posts');
  },
};
