const service = require('feathers-sequelize');
const Promise = require("bluebird");
const hooks = require("feathers-hooks-common");

module.exports = function() {
  const app = this;
  const User = app.get('models').User;
  const Class = app.get('models').Class;
  const RollCall = app.get('models').RollCall;

  const options = {
    Model: User
  };

  app.use('/users', service(options));

  app.use('/users/:id/classes', {
    create: function(data, params) {
      return User.findById(params.id).then(user => {
        return user.createOwnClass(data);
      });
    }
  });

  app.use('/users/:id/rollcalls', {
    create: function(data, params) {
      return User.findById(params.id).then(user => {
        return RollCall.create(data).then(rollCall => {
          user.addCreatedRollCall(rollCall);
          return rollCall;
        })
      })
    },

    find: function(params) {
      return User.findById(params.id).then(user => {
        return user.getAllRollCalls();
      });
    }
  });

  function checkClassId(values) {
    const errors = {};
    if (!Object.keys(values).includes('classId')) {
      errors.classId = "No class id provided."
    }
    return errors;
  }

  app.service('users/:id/rollcalls').before({create: [hooks.validate(checkClassId)]})
};
