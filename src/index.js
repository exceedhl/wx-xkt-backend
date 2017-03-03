'use strict';

const app = require('./app');
const port = app.get('port');
const server = app.listen(app.get('port'));

server.on('listening', () =>
  console.log(`Feathers application started on ${app.get('port')}`)
);
