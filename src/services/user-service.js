const service = require('feathers-sequelize');
const Promise = require("bluebird");

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
      return Promise.all([Class.create(data), User.findById(params.id)])
      .spread((c, user) => {
        return c.addOwner(user).then(() => {return c});
      });
    }
  });

  app.use('/users/:id/rollcalls', {
    create: function(data, params) {
      return User.findById(params.id, {include: [RollCall]}).then(user => {
        return RollCall.create(data).then(rollCall => {
          user.setRollcalls(rollCall);
          return rollCall;
        })
      })
    }
  });
};
