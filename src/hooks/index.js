'use strict';

const errors = require('feathers-errors');
const jwt = require('jsonwebtoken');

// Add any common hooks you want to share across services in here.
//
// Below is an example of how a hook is written and exported. Please
// see http://docs.feathersjs.com/hooks/readme.html for more details
// on hooks.

exports.wxAppAuth = function(hook) {
  if (hook.app.get("wxAppId") !== hook.params.headers['x-wx-app-id']) {
    throw new errors.NotAuthenticated("not authenticated wx app");
  }
};

exports.authHook = function(hook) {
  const User = hook.app.get('models').User;
  const authorization = hook.params.headers.authorization;
  if (!authorization) {
    throw new errors.NotAuthenticated("No Authorization header found");
  }
  let token = authorization.split(/\s/)[1];
  if (!token) {
    throw new errors.NotAuthenticated("No JWT token found");
  }
  const tokenSecret = hook.app.get('auth').token.secret;
  const decoded = jwt.verify(token, tokenSecret);
  return User.findById(decoded.id).then(user => {
    if (!user) {
      throw new errors.NotAuthenticated("No user found");
    }
    hook.params.currentUser = user;
    return hook;
  })
}
