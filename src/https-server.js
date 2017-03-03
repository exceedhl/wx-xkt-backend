'use strict';

const app = require('./app');
const fs = require('fs');
const https  = require('https');

const server = https.createServer({
  key: fs.readFileSync('./config/ssl/key.pem'),
  cert: fs.readFileSync('./config/ssl/cert.pem')
}, app).listen(app.get('port'));

app.setup(server);
