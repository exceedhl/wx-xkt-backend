'use strict';

const Sequelize = require('sequelize');
const Promise = require('bluebird');

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
    User.belongsToMany(Class, {through: UserClass, foreignKey: 'userId'});
    User.hasMany(RollCall, {as: 'createdRollCalls', foreignKey: 'ownerId'});
  }

  User.Instance.prototype.getCreatedClasses = function() {
    return this.getClasses({through: {where: {role: 'owner'}}});
  };

  User.Instance.prototype.getJoinedClasses = function() {
    return this.getClasses({through: {where: {role: 'student'}}});
  };

  // a lot of get models in multiple instance methods, could be better?
  User.Instance.prototype.getJoinedRollCalls = function() {
    const RollCall = app.get('models').RollCall;
    const Class = app.get('models').Class;
    return Promise.map(this.getJoinedClasses(), (c) => {
      return RollCall.findAll({include: [{model: Class, where: {id: c.get('id')}}]}).then(rollcalls => {
        return rollcalls;
      });
    }).reduce((result, rollcalls) => {
      return result.concat(rollcalls);
    }, []).then((rs) => {
      return rs;
    });
  };

  User.Instance.prototype.getAllRollCalls = function() {
    const Class = app.get('models').Class;
    return Promise.all([this.getJoinedRollCalls(),
      this.getCreatedRollCalls({include: [{model: Class}]})])
      .spread((joined, created) => {
      return joined.concat(created);
    });
  };

};
