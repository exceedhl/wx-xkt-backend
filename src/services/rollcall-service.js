const hooks = require("feathers-hooks-common");
const errors = require('feathers-errors');
const moment = require('moment');
const rp = require('request-promise');
const fs = require('fs');
moment.locale('zh-CN');

module.exports = function(){
  const app = this;
  const User = app.get('models').User;
  const RollCall = app.get('models').RollCall;
  const sequelize = app.get('sequelize');

  const dateKeyFormat = 'YYYY年MMMDo';

  function groupCallsByDay(calls) {
    let callsByDays = {};
    calls.forEach(call => {
      let key = call.dateKey;
      if (!callsByDays[key]) {
        callsByDays[key] = [];
      }
      callsByDays[key].push(call);
    });
    return callsByDays;
  }

  function groupDayCallsByYearMonth(callsByDays) {
    let months = {};
    Object.keys(callsByDays).forEach(date => {
      const createdAt = moment(date, dateKeyFormat);
      const yearMonth = createdAt.format('YYYY年MMM');
      const day = createdAt.format('Do');
      const weekDay = createdAt.format('ddd');
      if (!months[yearMonth]) {
        months[yearMonth] = [];
      }
      months[yearMonth].push({'calls': callsByDays[date], 'day': day, 'weekDay': weekDay});
    });
    let callsByYearMonth = [];
    Object.keys(months).forEach(yearMonth => {
      callsByYearMonth.push({'yearMonth': yearMonth, 'days': months[yearMonth]});
    })
    return callsByYearMonth;
  }

  function compareTimeDesc(a, b) {
    return a.createdAt < b.createdAt;
  }

  app.use('/rollcalls', {
    find: function(params) {
      return params.currentUser.getAllRollCalls().then(rcs => {
        let calls = [];
        rcs.forEach(rc => {
          let data = {};
          data.createdAt = rc.createdAt;
          data.dateKey = moment(rc.createdAt).format(dateKeyFormat);
          data.name = rc.name;
          data.class = rc.className;
          data.status = rc.status;
          data.id = rc.id;
          data.role = rc.role;
          calls.push(data);
        });
        calls.sort(compareTimeDesc);
        return groupDayCallsByYearMonth(groupCallsByDay(calls));
      });
    },

    get: function(id, params) {
      return sequelize.query(
      `select U.id as id
        from rollcalls_detail as RCD
        inner join users as U
        where RCD.status = 'attend' and RCD.userId = U.id and RCD.rollcallId = ` + id,
        { type: sequelize.QueryTypes.SELECT, raw: true }).then(attends => {
          let attendIds = attends.map((u) => {
            return u.id;
          });
          return sequelize.query(
          `select 'absent' as status,
            U.avatarUrl as avatarUrl,
            U.name as name,
            U.id as id
            from users_classes as UC,
            rollcalls as RC,
            users as U
            where UC.userId = U.id and UC.role = 'student' and UC.classId = RC.classId and RC.id = ` + id,
            { type: sequelize.QueryTypes.SELECT, raw: true }).then(all => {
              for (let u of all) {
                if (attendIds.includes(u.id)) {
                  u.status = 'attend';
                }
              }
              return all;
            })
        });
    },

    create: function(data, params) {
      data.name = moment().format('HH:mm') + '的点名';
      return params.currentUser.createCreatedRollCall(data);
    },

    remove: function(id) {
      return RollCall.destroy({where: {id: id}});
    }
  });

  app.use('/rollcalls/:id/join', {
    create: function(data, params) {
      return RollCall.findById(params.id).then(rc => {
        return rc.addStudent(params.currentUser);
      });
    }
  });

  function checkClassId(values) {
    const errors = {};
    if (!Object.keys(values).includes('classId')) {
      errors.classId = "No class id provided."
    }
    return errors;
  }

  app.service('rollcalls').before({create: [hooks.validate(checkClassId)]});

  app.use('/rollcalls/:id/summary', {
    find: function(params) {
      return RollCall.findById(params.id).then(rc => {
        return rc.getSummary();
      });
    }
  });

  app.use('/rollcalls/:id/barcode', {
    find: function(id, params) {
      const appId = app.get('wx').appId;
      const appSecret = app.get('wx').appSecret;
      const url = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' + appId + '&secret=' + appSecret;

      return rp({uri: url, json: true}).then((body) => {
        app.logger.debug("WX access token result: " + JSON.stringify(body));
        if (body.access_token) {
          return body.access_token;
        } else {
          return new errors.NotAuthenticated('WX access token fetch failed: ' + JSON.stringify(body));
        }
      }).then(access_token => {
        const barcodeUrl = 'https://api.weixin.qq.com/cgi-bin/wxaapp/createwxaqrcode?access_token=' + access_token;
        const options = {
          method: 'POST',
          uri: barcodeUrl,
          encoding: 'binary',
          body: {
            path: 'pages/rollcall/ongoing?id=' + params.id
          },
          json: true
        };
        return rp(options).then(body => {
          return Buffer.from(body, 'binary').toString('base64');
        });
      });
    }
  });
};
