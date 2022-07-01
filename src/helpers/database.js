const Sequelize = require('sequelize');

const sequelize = new Sequelize(
  'test-nodejs',
  'root',
  'root-user4',
  {
    dialect: 'mysql',
    host: 'localhost'
  }
);

module.exports = sequelize;
