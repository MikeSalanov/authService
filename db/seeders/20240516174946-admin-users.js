'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const admin = [{
      id: 'e14791a7-4bf3-4a5f-a3f4-81b6e77c6685',
      email: 'admin@admin',
      password: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    }];
    return queryInterface.bulkInsert('Users', admin);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Users');
  },
};
