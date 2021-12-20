'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
    }
  };
  Event.init({
    author_id: DataTypes.INTEGER,
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
    likes: DataTypes.INTEGER,
    status: DataTypes.ENUM('active', 'inactive'),
    numberOfTickets: DataTypes.INTEGER,
    ticketPrice: DataTypes.INTEGER,
    promoCode: {type: DataTypes.STRING, unique: true},
    eventLocation: DataTypes.STRING,
    eventDate: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Event',
    timestamps: false
  });
  return Event;
};