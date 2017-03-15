const errors = require('feathers-errors');
const jwt = require('jsonwebtoken');
const Promise = require('bluebird');

let checkJWT;
if (process.env.NODE_ENV == 'development') {
  console.log('in development mode');
  checkJWT = function(app, headers) {
    const User = app.get('models').User;
    return User.findById(headers.userid);
  }
} else {
  checkJWT = require('../hooks/check-jwt');
}

module.exports = function(){
  const app = this;
  const RollCall = app.get('models').RollCall;
  const RollCallDetail = app.get('models').RollCallDetail;
  const expressWs = require('express-ws')(app);

  function broadcast(message) {
    for (let client of expressWs.getWss().clients) {
      client.send(message);
    }
  }

  function getAttends(users) {
    let attends = 0;
    for (let s of users.values()) {
      if (s == 'attend') {
        attends++;
      }
    }
    return attends;
  }

  let calls = new Map();

  app.ws('/call-ws', function(ws, req) {
    let user = null;
    ws.on('message', function(msg) {
      try {
        let decodedMSG = JSON.parse(msg);
        let messageType = decodedMSG.message;
        let data = decodedMSG.payload;
        if (messageType == 'Auth') {
          user = checkJWT(app, data);
          return;
        }
        user.then(user => {
          let rcID = data.rollcallId;

          if (!calls.has(rcID)) {
            let rollcallState = new Map();
            rollcallState.set('users', new Map());
            rollcallState.set('incall', false);
            rollcallState.set('code', null);
            calls.set(rcID, rollcallState);
          }

          let state = calls.get(rcID);

          switch (messageType) {
            case 'JoinCall':
              state.get('users').set(user.get('id'), 'absent');
              break;
            case 'StartTimer':
              let seconds = parseInt(data.seconds);
              state.set('incall', true);
              state.set('code', data.code);
              broadcast(JSON.stringify({message: 'TimerStarted', payload: {rollcallId: rcID, seconds: seconds}}));
              Promise.delay(seconds * 1000).then(() => {
                state.set('incall', false);
                broadcast(JSON.stringify({message: 'TimeOut', payload: {rollcallId: rcID}}));
              });
              break;
            case 'InputCode':
              if (state.get('incall') && data.code == state.get('code')) {
                state.get('users').set(user.get('id'), 'attend');
                ws.send(JSON.stringify({message: 'CodeCompare', payload: {result: true}}));
                broadcast(JSON.stringify({message: 'Attends', payload: {rollcallId: rcID, no: getAttends(state.get('users'))}}));
              }
              break;
            case 'EndCall':
              state.set('incall', false);
              broadcast(JSON.stringify({message: 'EndCall', payload: {rollcallId: rcID}}));
              callDetailData = [];
              for (let [userId, status] of state.get('users')) {
                callDetailData.push({status: status, userId: userId, rollcallId: rcID});
              }
              RollCallDetail.bulkCreate(callDetailData).then(() => {
                app.logger.debug('RollCall ' + rcID + ' detail stored.');
              });
              RollCall.findById(rcID).then(rc => {
                rc.update({'status': 'done'});
              });
              break;
            default:
          }
          app.logger.debug(calls);
        });
      } catch(e) {
        app.logger.error(e);
      }
    });

    return ws;
  });
}
