'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Movies', 'UserId', Sequelize.INTEGER);
    await queryInterface.addConstraint('Movies', {
      fields: ['UserId'],
      type: 'foreign key',
      name: 'custom_fk_UserId',
      references: {
        table: 'Users',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('Movies', 'custom_fk_UserId');
    await queryInterface.removeColumn('Movies', 'UserId');
  },
};
