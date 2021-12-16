'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
    }
  };

  User.init({
    login: DataTypes.STRING,
    real_name: DataTypes.STRING,
    email: DataTypes.STRING,
    token: DataTypes.STRING,
    password: DataTypes.STRING,
    rating: DataTypes.INTEGER,
    password_reset_token: DataTypes.STRING,
    image_path: DataTypes.STRING,
    role: DataTypes.ENUM('admin', 'user', 'company'),
  }, {
    sequelize,
    modelName: 'User',
    timestamps: false
  });
  return User;
};