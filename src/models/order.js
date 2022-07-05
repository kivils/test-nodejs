const Sequelize = require('sequelize');

const sequelize = require('../helpers/database');

const Order = sequelize.define(
  'order',
  {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    totalPrice: {
      type: Sequelize.DOUBLE,
      allowNull: false
    }
  }
)

module.exports = Order;
