'use strict';

const errors = require('feathers-errors');

// Add any common hooks you want to share across services in here.
//
// Below is an example of how a hook is written and exported. Please
// see http://docs.feathersjs.com/hooks/readme.html for more details
// on hooks.

exports.wxAppAuth = function(options) {
  return function(hook) {
    if (hook.app.get("wxAppId") !== hook.params.headers['x-wx-app-id']) {
      throw new errors.NotAuthenticated("not authenticated wx app");
    }
  };
};
