const app = require('./src/app');
const fixture = require('./test/fixture/test-data');
const argv = require('optimist').argv;

const sequelize = app.get('sequelize');

if (argv.clean) {
  fixture.cleanData(sequelize);
}
if (argv.populate) {
  fixture.populateData(sequelize);
}
