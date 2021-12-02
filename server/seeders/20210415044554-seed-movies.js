'use strict';

const movies = require('../movies.json');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Movies',
      movies.map((el) => {
        return { ...el, createdAt: new Date(), updatedAt: new Date() };
      })
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Movies', null, {});
  },
};
