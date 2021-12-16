'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Comments', [
      {
        author_id_comment: 1,
        event_id_comment: 2,
        content_comment: 'some comment',
        likes_comment: 0,
        status_comment: 'active'
      },
      {
        author_id_comment: 3,
        event_id_comment: 1,
        content_comment: 'some comment',
        likes_comment: 0,
        status_comment: 'inactive'
      },
      {
        author_id_comment: 4,
        event_id_comment: 1,
        content_comment: 'some comment',
        likes_comment: -1,
        status_comment: 'active'
      },
      {
        author_id_comment: 1,
        event_id_comment: 2,
        content_comment: 'some comment',
        likes_comment: 0,
        status_comment: 'active'
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Comments', {}, null);
  }
};
