'use strict';

const Sequelize = require('sequelize');

module.exports = function(app, sequelize) {

  const UserClass = sequelize.define("UserClass", {
    role: Sequelize.ENUM('owner', 'student')
  }, {tableName: 'users_classes'});

};
