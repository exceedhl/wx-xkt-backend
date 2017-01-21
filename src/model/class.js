'use strict';

const Sequelize = require('sequelize');

module.exports = function(app, sequelize) {

  const Class = sequelize.define('Class', {
    name: {type: Sequelize.STRING, allowNull: false}
  }, {tableName: 'classes'});

  Class.associate = function() {
    const User = app.get('models').User;
    const Class = app.get('models').Class;
    const UserClass = app.get('models').UserClass;
    Class.belongsToMany(User, {through: UserClass, foreignKey: 'classId'});
  }

  Class.Instance.prototype.getStudents = function() {
    return this.getUsers({through: {where: {role: 'student'}}});
  };

  Class.Instance.prototype.includeUser = function(userId) {
    return this.getUsers().then(users => {
      let userIds = users.map(user => {
        return user.get('id');
      });
      return userIds.includes(userId) ? true : false;
    });
  };

  Class.Instance.prototype.addOwner = function(user) {
    return this.addUser(user, {role: 'owner'});
  }

  Class.Instance.prototype.addStudent = function(user) {
    return this.addUser(user, {role: 'student'});
  }
};
