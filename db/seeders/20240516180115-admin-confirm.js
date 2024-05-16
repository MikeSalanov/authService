'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const adminConfirm = [
      {
        register_confirmed: true,
        confirmation_code:
          'vvdaO2HfSSJmgw8LzBrRQZZU5LT3tQBbdTtUEvqCNzHCMqzcdbqhTneMfRUGs11W',
        user_id: 'e14791a7-4bf3-4a5f-a3f4-81b6e77c6685',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    return queryInterface.bulkInsert('registration_confirms', adminConfirm);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('registration_confirms');
  },
};
