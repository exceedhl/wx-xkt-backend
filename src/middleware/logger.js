'use strict';

module.exports = function(app) {

  return function(error, req, res, next) {
    if (error) {
      const message = `${error.code ? `(${error.code}) ` : '' }Route: ${req.url} - ${error.message}`;

      if (error.code === 404) {
        app.logger.info(message);
      }
      else {
        app.logger.error(message);
        app.logger.info(error.stack);
      }
    }

    next(error);
  };
};
