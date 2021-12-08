const Sequelize = require('sequelize');
const db = require('database/db');

const Post = db.define(
  'post',
  {
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
  },
  {
    indexes: [
      {
        fields: ['fk_user_id'],
      },
    ],
  },
);

Post.associate = models => {
  Post.belongsTo(models.user, {
    foreignKey: 'fkUserId',
    as: 'writer',
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
  });
};

module.exports = Post;
