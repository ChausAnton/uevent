'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Likes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Likes.init({
    author_id: DataTypes.INTEGER,
    event_id: {
      type: DataTypes.INTEGER,

    },
    comment_id: DataTypes.INTEGER,
    type: DataTypes.ENUM('like', 'dislike')
  }, {
    sequelize,
    modelName: 'Likes',
    timestamps: false
  });
  return Likes;
};