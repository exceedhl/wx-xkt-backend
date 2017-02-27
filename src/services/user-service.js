const service = require('feathers-sequelize');
const Promise = require("bluebird");

module.exports = function() {
  const app = this;
  const User = app.get('models').User;

  const options = {
    Model: User
  };

  app.use('/users', service(options));

  app.use('/profile', {
    find: function(params) {
      return Promise.resolve(params.currentUser);
    }
  });

  app.use('/changename', {
    update: function(id, data, params) {
      return params.currentUser.update(data);
    }
  });

};
