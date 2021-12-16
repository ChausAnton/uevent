'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Category_sub_tables', [
      {
        event_id: 1,
        category_id: 1
      },
      {
        event_id: 1,
        category_id: 2
      },
      {
        event_id: 2,
        category_id: 1
      },
      {
        event_id: 2,
        category_id: 3
      },
      {
        event_id: 3,
        category_id: 5
      },
      {
        event_id: 4,
        category_id: 5
      },
      {
        event_id: 4,
        category_id: 1
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Category_sub_tables', {}, null);
  }
};
