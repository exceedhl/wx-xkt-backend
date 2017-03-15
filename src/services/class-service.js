const Promise = require("bluebird");

module.exports = function(){
  const app = this;

  const User = app.get('models').User;
  const Class = app.get('models').Class;

  app.use('/classes', {
    find: function(params) {
      return params.currentUser.getCreatedClasses();
    },

    create: function(data, params) {
      return params.currentUser.createOwnClass(data);
    },

    update: function(id, data, params) {
      return Class.findById(id).then(c => {
        return c.update(data);
      });
    }
  });

  app.use('joinedClasses', {
    find: function(params) {
      return params.currentUser.getJoinedClasses();
    }
  });
};
