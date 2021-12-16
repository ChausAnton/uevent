'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Categories', [
      {
        category_title: "some category_title",
        description: "some description"
      },
      {
        category_title: "some category_title1",
        description: "some description1"
      },
      {
        category_title: "some category_title2",
        description: "some description2"
      },
      {
        category_title: "some category_title3",
        description: "some description3"
      },
      {
        category_title: "some category_title4",
        description: "some description4"
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Categories', {}, null);
  }
};
