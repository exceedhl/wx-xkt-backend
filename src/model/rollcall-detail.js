'use strict';

const Sequelize = require('sequelize');

module.exports = function(app, sequelize) {

  const RollCallDetail = sequelize.define('RollCallDetail', {
    status: {
      type: Sequelize.ENUM('attend', 'absent'),
      defaultValue: 'absent'
    }
  }, {tableName: 'rollcalls_detail'});

  RollCallDetail.associate = function() {
    const User = app.get('models').User;
    const RollCall = app.get('models').RollCall;
    RollCallDetail.belongsTo(User, {foreignKey: 'userId'});
    RollCallDetail.belongsTo(RollCall, {foreignKey: 'rollcallId'});
  }

};
