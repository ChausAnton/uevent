'use strict';
var bcrypt = require("bcryptjs");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [
      {
        login: 'Admin',
        real_name: 'admin1',
        email: '11@gmail.com',
        password: bcrypt.hashSync('1111', 8),
        rating: '0',
        image_path: 'User.png',
        role: 'admin'
      },
      {
        login: 'user1',
        real_name: 'user1',
        email: '22@gmail.com',
        password: bcrypt.hashSync('1111', 8),
        rating: '1',
        image_path: 'User.png',
        role: 'user'
      },
      {
        login: 'user2',
        real_name: 'user2',
        email: '33@gmail.com',
        password: bcrypt.hashSync('1111', 8),
        rating: '1',
        image_path: 'User.png',
        role: 'user'
      },
      {
        login: 'user3',
        real_name: 'user3',
        email: '44@gmail.com',
        password: bcrypt.hashSync('1111', 8),
        rating: '1',
        image_path: 'User.png',
        role: 'user'
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', {}, null);
  }
};
