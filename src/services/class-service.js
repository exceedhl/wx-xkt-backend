const service = require('feathers-sequelize');
const Promise = require("bluebird");
const hooks = require('feathers-hooks');

module.exports = function(){
  const app = this;

  const User = app.get('models').User;
  const Class = app.get('models').Class;

  const options = {
    Model: Class
  };

  app.use('/classes', service(options));

  app.service('classes').before({
    patch: hooks.disable(),
    create: hooks.disable()
  });

  app.use('/classes/:id/users/:userId', {
    create: (data, params) => {
      return Promise.all([Class.findById(params.id), User.findById(params.userId)])
      .spread((c, user) => {
        return c.includeUser(parseInt(params.userId)).then(result => {
          if (!result) {
            return c.addStudent(user);
          } else {
            return Promise.resolve("User already in Class.");
          }
        });
      });
    }
  });

};
