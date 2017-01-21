'use strict';

module.exports = function() {
  return function(req, res, next) {
    req.feathers.headers = req.headers;
    next();
  };
};
