'use strict';

const assert = require('assert');
const app = require('../src/app');
const WebSocket = require('ws');

describe.skip('CallWebSocket', function() {
  before(function(done) {
    this.server = app.listen(3030);
    this.server.once('listening', () => done());
    this.ws = new WebSocket('ws://localhost:3030/call-ws');
    console.log(this.ws.readyState)
  });

  after(function(done) {
    this.server.close(done);
    this.ws.close();
  });

  it('should accept connection', function(done) {
    done();
  });

});
