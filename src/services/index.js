'use strict';
const userService = require('./user-service');
const classService = require('./class-service');
const rollcallService = require('./rollcall-service');
const authService = require('./authenticate-service');
const callws = require('./call-ws');
const globalHooks = require('../hooks');
const hooks = require('feathers-hooks');

module.exports = function() {
  const app = this;

  app.configure(userService);
  app.configure(classService);
  app.configure(rollcallService);
  app.configure(authService);
  app.configure(callws);

  const before = {
    all: [globalHooks.wxAppAuth, globalHooks.authHook]
  };

  for (var key in app.services) {
    if (key != 'wx-login') {
      app.services[key].before(before);
    }
  }
};
