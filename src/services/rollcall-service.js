const service = require('feathers-sequelize');

module.exports = function(){
  const app = this;
  const options = {
    Model: app.get('models').RollCall
  };

  app.use('/rollcalls', service(options));
};
