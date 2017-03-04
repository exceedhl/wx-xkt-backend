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

  RollCall.Instance.prototype.getSummary = function() {
    return sequelize.query(
    `select count(*) as peopleAttend
      from rollcalls_detail
      where status = 'attend' and rollcallId = ` + this.get('id'),
      { type: sequelize.QueryTypes.SELECT, raw: true, plain: true}).then(attends => {
        return sequelize.query(
        `select count(UC.id) as peopleAll
          from users_classes as UC,
          rollcalls as RC
          where UC.role = 'student' and UC.classId = RC.classId and RC.id = ` + this.get('id'),
          { type: sequelize.QueryTypes.SELECT, raw: true, plain: true}).then(all => {
            return Object.assign(all, attends);
          })
      });
  }

};
