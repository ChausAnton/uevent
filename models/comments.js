'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Comments.init({
    author_id_comment: DataTypes.INTEGER,
    event_id_comment: DataTypes.INTEGER,
    content_comment: DataTypes.STRING,
    likes_comment: DataTypes.INTEGER,
    status_comment: DataTypes.ENUM('active', 'inactive')
  }, {
    sequelize,
    modelName: 'Comments',
    timestamps: false
  });
  return Comments;
};