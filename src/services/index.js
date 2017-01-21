'use strict';
const userService = require('./user-service');
const classService = require('./class-service');
const rollcallService = require('./rollcall-service');
const globalHooks = require('../hooks');
const hooks = require('feathers-hooks');

module.exports = function() {
  const app = this;

  app.configure(userService);
  app.configure(classService);
  app.configure(rollcallService);

  const before = {
    all: [globalHooks.wxAppAuth()]
  };

  for (var key in app.services) {
      app.services[key].before(before);
  }
};
