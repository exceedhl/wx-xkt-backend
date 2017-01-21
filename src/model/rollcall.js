'use strict';

const Sequelize = require('sequelize');

module.exports = function(app, sequelize) {

  const RollCall = sequelize.define('RollCall', {
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    status: {
      type: Sequelize.ENUM('todo', 'ongoing', 'done'),
      defaultValue: 'todo'
    }
  }, {tableName: 'rollcalls'});

  RollCall.associate = function() {
    const Class = app.get('models').Class;
    const RollCall = app.get('models').RollCall;
    RollCall.belongsTo(Class, {foreignKey: 'classId'});
  }

};
