'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Profiles', 'birthday', Sequelize.DATE);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Profiles', 'birthday');
  }
};
