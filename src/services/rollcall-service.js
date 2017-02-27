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

    create: function(data, params) {
      data.name = moment().format('HH:mm') + '的点名';
      return params.currentUser.createCreatedRollCall(data);
    },

    remove: function(id) {
      return RollCall.destroy({where: {id: id}});
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
          body: {
            path: 'pages/rollcall/ongoing?id=' + params.id
          },
          json: true
        };
        return rp(options).then(body => {
          // fs.writeFile('barcode.jpg', new Buffer(body.body), function(err){
          //   if (err) throw err;
          //   console.log('File saved.');
          // });
          return Buffer.from(body, 'binary').toString('base64');
        });
      });
    }
  });
};
