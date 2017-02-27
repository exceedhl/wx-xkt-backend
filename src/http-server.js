'use strict';

const app = require('./app');
const port = app.get('port');
const server = app.listen(3031);

server.on('listening', () =>
  console.log(`Feathers application started on 3031`)
);
