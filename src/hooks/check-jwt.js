'use strict';

const errors = require('feathers-errors');
const jwt = require('jsonwebtoken');

module.exports = function(app, headers) {
  const User = app.get('models').User;
  const authorization = headers.authorization;
  if (!authorization) {
    throw new errors.NotAuthenticated("No Authorization header found");
  }
  let token = authorization.split(/\s/)[1];
  if (!token) {
    throw new errors.NotAuthenticated("No JWT token found");
  }
  const tokenSecret = app.get('auth').token.secret;
  const decoded = jwt.verify(token, tokenSecret);
  return User.findById(decoded.id).then(user => {
    if (!user) {
      throw new errors.NotAuthenticated("No user found");
    }
    return user;
  })
}
