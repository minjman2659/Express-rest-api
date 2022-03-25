const Sequelize = require('sequelize');
const db = require('database/db');

const Post = db.define(
  'Post',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: Sequelize.STRING(100),
    text: Sequelize.TEXT,
    thumbnail: Sequelize.STRING,
    userId: { type: Sequelize.INTEGER },
    createdAt: { type: Sequelize.DATE },
    updatedAt: { type: Sequelize.DATE },
  },
  {
    indexes: [
      {
        fields: ['userId'],
      },
    ],
  },
);

Post.associate = models => {
  Post.belongsTo(models.User, {
    foreignKey: 'userId',
    as: 'writer',
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
  });
};

module.exports = Post;
