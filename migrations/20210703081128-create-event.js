'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Events', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      author_id: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        references: {
          model: 'Users',
          key: 'id',
        }
      },
      title: {
        type: Sequelize.STRING
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      likes: {
        type: Sequelize.INTEGER
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive')
      },
      numberOfTickets: { 
        type: Sequelize.INTEGER
      },
      ticketPrice: {
        type: Sequelize.INTEGER
      },
      promoCode: {
        type: Sequelize.STRING, 
        unique: true
      },
      eventLocation: {
        type: Sequelize.STRING
      },
      EventCreatedAt: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
      },
      EventCreatedAt: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Events');
  }
};