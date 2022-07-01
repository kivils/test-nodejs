const Sequelize = require('sequelize');

const sequelize = require('../helpers/database');

const Product = sequelize.define(
  'product', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    imgUrl: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'https://cdn.pixabay.com/photo/2013/07/12/18/22/t-shirt-153370_960_720.png'
    },
    price: {
      type: Sequelize.DOUBLE,
      allowNull: false
    }
  }
);

module.exports = Product;
