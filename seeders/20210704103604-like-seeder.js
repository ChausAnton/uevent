'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Likes', [
      {
        author_id: 1,
        event_id: 2,
        type: 'like'
      },
      {
        author_id: 1,
        event_id: 1,
        type: 'like'
      },
      {
        author_id: 1,
        comment_id: 3,
        type: 'dislike'
      },
      {
        author_id: 2,
        event_id: 3,
        type: 'like'
      },
      {
        author_id: 2,
        event_id: 2,
        type: 'like'
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Likes', {}, null);
  }
};
