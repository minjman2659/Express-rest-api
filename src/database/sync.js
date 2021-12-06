const db = require('./db');

const { models } = db;

// https://jeonghwan-kim.github.io/dev/2020/07/06/sequelize-model.html 참고
const associate = () => {
  // console.log(models);
  Object.values(models).forEach(model => {
    // console.log(model);
    if (model.associate) {
      model.associate(models);
    }
  });
};

const sync = () => {
  associate();
  db.sync({ force: true });
};

module.exports = { associate, sync };
