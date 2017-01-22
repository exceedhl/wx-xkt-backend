'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('rollcalls_detail', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      createdAt: {
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE
      },
      status: {
        type: Sequelize.ENUM('attend', 'absent'),
        defaultValue: 'absent'
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      rollcallId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'rollcalls',
          key: 'id'
        }
      }
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('rollcalls_detail');
  }
};
