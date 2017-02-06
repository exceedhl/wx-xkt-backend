'use strict';

const Sequelize = require('sequelize');
const logger = require('winston');

module.exports = function() {

  const app = this;
  const sequelize = new Sequelize(app.get('mysql'), {
    dialect: 'mysql',
    logging: logger.debug
  });

  require('./user')(app, sequelize);
  require('./user-class')(app, sequelize);
  require('./class')(app, sequelize);
  require('./rollcall')(app, sequelize);
  require('./rollcall-detail')(app, sequelize);

  app.set('models', sequelize.models);
  app.set('sequelize', sequelize);

  Object.keys(sequelize.models).forEach(modelName => {
    if ('associate' in sequelize.models[modelName]) {
      sequelize.models[modelName].associate();
    }
  });
};
