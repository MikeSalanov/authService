'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const admin = [{
      id: 'e14791a7-4bf3-4a5f-a3f4-81b6e77c6685',
      email: 'admin@admin',
      password: '$2b$10$ugoB7.MJmr8ifjmqMyTp4evteOdzk4FlxIt0s7NnXxKIZ9i.KvjmS',
      createdAt: new Date(),
      updatedAt: new Date(),
    }];
    return queryInterface.bulkInsert('Users', admin);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Users');
  },
};
