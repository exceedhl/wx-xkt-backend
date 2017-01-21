'use strict';

const Sequelize = require('sequelize');

module.exports = function(app, sequelize) {

  const User = sequelize.define('User', {
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    age: {
      type: Sequelize.INTEGER
    },
    gender: Sequelize.STRING,
    avatarUrl: Sequelize.STRING,
    nickName: Sequelize.STRING
  }, {tableName: 'users'});

  User.associate = function() {
    const User = app.get('models').User;
    const Class = app.get('models').Class;
    const RollCall = app.get('models').RollCall;
    const UserClass = app.get('models').UserClass;

    User.belongsToMany(Class, {through: UserClass});
    User.hasMany(RollCall);
  }

  User.Instance.prototype.getCreatedClasses = function() {
    return this.getClasses({through: {where: {role: 'owner'}}});
  };

  User.Instance.prototype.getJoinedClasses = function() {
    return this.getClasses({through: {where: {role: 'student'}}});
  };

};
