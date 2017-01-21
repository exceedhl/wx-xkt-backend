const service = require('feathers-sequelize');
const hooks = require('feathers-hooks');

module.exports = function(){
  const app = this;
  const options = {
    Model: app.get('models').RollCall
  };

  app.use('/rollcalls', service(options));

  app.service('rollcalls').before({
    patch: hooks.disable(),
    create: hooks.disable(),
    update: hooks.disable(),
  });
};
