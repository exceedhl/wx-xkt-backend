'use strict';

const Sequelize = require('sequelize');
const Promise = require('bluebird');

module.exports = function(app, sequelize) {

  const User = sequelize.define('User', {
    name: {
      type: Sequelize.STRING
    },
    avatarUrl: Sequelize.STRING,
    nickName: Sequelize.STRING,
    wxUnionId: Sequelize.STRING
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

  User.Instance.prototype.createOwnClass = function(data) {
    return this.createClass(data, {role: 'owner'});
  }

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
    return Promise.all([this.getMyRollCalls(), this.getMyJoinedRollCalls()]).spread((rcs1, rcs2) => {
      return rcs1.concat(rcs2);
    });
  };

  User.Instance.prototype.getMyRollCalls = function() {
    return sequelize.query(
      `select RC.id as id,
        RC.name as name,
        RC.status as status,
        RC.createdAt as createdAt,
        'owner' as role,
        C.name as className
      from rollcalls as RC
      inner join classes as C
      where C.id = RC.classId and RC.ownerId = ` + this.get('id'), { type: sequelize.QueryTypes.SELECT, raw: true });
  };

  User.Instance.prototype.getMyJoinedRollCalls = function() {
    return sequelize.query(
      `select RC.id as id,
        RC.name as name,
        RC.status as status,
        RC.createdAt as createdAt,
        'student' as role,
        C.name as className
      from rollcalls as RC, classes as C, users_classes as UC
      where C.id = RC.classId and UC.classId = RC.classId and UC.role = 'student' and UC.userId = ` + this.get('id'), { type: sequelize.QueryTypes.SELECT, raw: true });
  };

};
