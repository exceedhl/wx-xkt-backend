const Promise = require("bluebird");
const rp = require('request-promise');
const WXBizDataCrypt = require('../util/WXBizDataCrypt');
const errors = require('feathers-errors');
const jwt = require('jsonwebtoken');

module.exports = function(){
  const app = this;
  const User = app.get('models').User;

  function generateJWTToken(user) {
    return jwt.sign({id: user.get('id')}, app.get('auth').token.secret);
  }

  function findOrCreateUser(openid, wxUserInfo) {
    return User.findOne({where: {wxUnionId: openid}}).then(user => {
      if (!user) {
        app.logger.info('New wx user');
        return User.create({
          avatarUrl: wxUserInfo.avatarUrl,
          wxUnionId: openid,
          name: wxUserInfo.nickName,
          nickName: wxUserInfo.nickName}).then(user => {
          return user;
        })
      } else {
        app.logger.info('Existing wx user');
        return user;
      }
    })
  }

  app.use('/wx-login', {
    create: (data, params) => {
      const appId = app.get('wx').appId;
      const appSecret = app.get('wx').appSecret;
      const encryptedData = data.encryptedData;
      const iv = data.iv;

      let url = 'https://api.weixin.qq.com/sns/jscode2session?';
      url += 'appid=' + appId;
      url += '&secret=' + appSecret;
      url += '&js_code=' + data.code;
      url += '&grant_type=authorization_code';

      return rp({uri: url, json: true}).then((body) => {
        app.logger.debug("WX jscode2session result: " + JSON.stringify(body));
        if (body.openid) {
          let pc = new WXBizDataCrypt(appId, body.session_key);
          let wxUserInfo = pc.decryptData(encryptedData , iv)
          return findOrCreateUser(body.openid, wxUserInfo).then(user => {
            return generateJWTToken(user);
          })
        } else {
          return new errors.NotAuthenticated('WX session fetch failed: ' + JSON.stringify(body));
        }
      })
    }
  });

};
