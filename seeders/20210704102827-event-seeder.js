'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Events', [
      {
        author_id: 4,
        title: 'some title',
        content: 'some content',
        likes: 1,
        status: 'active',
        numberOfTickets: 60,
        ticketPrice: 300,
        promoCode: "4c4c",
        eventLocation: "some location",
        eventDate: "2021-12-16"
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
        eventLocation: "some location",
        eventDate: "2021-12-16"
      },
      {
        author_id: 4,
        title: 'some title',
        content: 'some content',
        likes: 1,
        status: 'active',
        numberOfTickets: 60,
        ticketPrice: 300,
        promoCode: "4b4c",
        eventLocation: "some location",
        eventDate: "2021-12-16"
      },
      {
        author_id: 4,
        title: 'some title',
        content: 'some content',
        likes: 0,
        status: 'inactive',
        numberOfTickets: 60,
        ticketPrice: 300,
        promoCode: "4v4c",
        eventLocation: "some location",
        eventDate: "2021-12-16"
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Events', {}, null);
  }
};
