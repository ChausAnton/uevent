'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Events', [
      {
        author_id: 3,
        title: 'some title',
        content: 'some content',
        likes: 1,
        status: 'active',
        numberOfTickets: 60,
        ticketPrice: 300,
        promoCode: "4c4c",
        eventLocation: "some location"
      },
      {
        author_id: 4,
        title: 'some title',
        content: 'some content',
        likes: 2,
        status: 'active',
        numberOfTickets: 60,
        ticketPrice: 300,
        promoCode: "4n4c",
        eventLocation: "some location"
      },
      {
        author_id: 2,
        title: 'some title',
        content: 'some content',
        likes: 1,
        status: 'active',
        numberOfTickets: 60,
        ticketPrice: 300,
        promoCode: "4b4c",
        eventLocation: "some location"
      },
      {
        author_id: 1,
        title: 'some title',
        content: 'some content',
        likes: 0,
        status: 'inactive',
        numberOfTickets: 60,
        ticketPrice: 300,
        promoCode: "4v4c",
        eventLocation: "some location"
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Events', {}, null);
  }
};
