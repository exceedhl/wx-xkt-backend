'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    console.log("create class")
    return queryInterface.createTable('classes', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {type: Sequelize.STRING, allowNull: false},
      createdAt: {
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE
      }
    }).then(() => {
      console.log("create user")
      queryInterface.createTable('users', {
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
        name: {
          type: Sequelize.STRING
        },
        avatarUrl: Sequelize.STRING,
        nickName: Sequelize.STRING,
        wxUnionId: Sequelize.STRING
      });
    }).then(() => {
      console.log("create users classes")
      queryInterface.createTable('users_classes', {
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
        role: Sequelize.ENUM('owner', 'student'),
        userId: {
          type: Sequelize.INTEGER,
          references: {
              model: 'users',
              key: 'id'
          }
        },
        classId: {
          type: Sequelize.INTEGER,
          references: {
              model: 'classes',
              key: 'id'
          }
        }
      });
    }).then(() => {
      console.log("create rollcalls")
      queryInterface.createTable('rollcalls', {
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
        name: {
          type: Sequelize.STRING,
          allowNull: false
        },
        status: {
          type: Sequelize.ENUM('todo', 'ongoing', 'done'),
          defaultValue: 'todo'
        },
        classId: {
          type: Sequelize.INTEGER,
          references: {
              model: 'classes',
              key: 'id'
          }
        },
        ownerId: {
          type: Sequelize.INTEGER,
          references: {
              model: 'users',
              key: 'id'
          }
        }
      });
    });
  },

  down: function (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.dropTable('rollcalls'),
      queryInterface.dropTable('users_classes'),
      queryInterface.dropTable('users'),
      queryInterface.dropTable('classes')
    ]);
  }
};
