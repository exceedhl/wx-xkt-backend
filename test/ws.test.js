'use strict';

const chai = require('chai');
const assert = chai.assert;
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

const app = require('../src/app');
const fixture = require('./fixture/test-data');
const WebSocket = require('ws');
const sequelize = app.get('sequelize');
const data = fixture.data;

const request = require('request');

describe('CallWebSocket', function() {
  before(function() {
    return fixture.cleanData(sequelize).then(() => {
      return fixture.populateData(sequelize);
    }).then(() => {
      this.server = app.listen(3030);
      return this.server;
    });
  });

  after(function() {
    this.server.close();
  });

  it('should process rollcall successfully', function(done) {
    let teacher = new WebSocket('ws://localhost:3030/call-ws');
    // let s1 = new WebSocket('ws://localhost:3030/call-ws');
    // let s2 = new WebSocket('ws://localhost:3030/call-ws');
    //
    teacher.on('open', function() {
      console.log('opneed')
      done();
    })

    // teacher.send({message: 'StartCall', payload: {userId: data.teacher.id, rollcallId: data.rollcall.id}});
    // s1.send({message: 'JoinCall', payload: {userId: data.s1.id, classId: data.rollcall.id}});
    // s2.send({message: 'JoinCall', payload: {userId: data.s2.id, classId: data.rollcall.id}});
    //
    // teacher.send({message: 'StartTimer', payload: {senconds: 20, code: 1234}});
    // s1.send({message: 'InputCode', payload: {code: 1234}});
    // s2.send({message: 'InputCode', payload: {code: 2345}});
    //
    // s1.on('message', (data, flags) => {
    //   if (data.message == 'CodeCompare') {
    //     assert.isOk(data.payload.result);
    //   }
    // });
    //
    // s2.on('message', (data, flags) => {
    //   if (data.message == 'CodeCompare') {
    //     assert.isNotOk(data.payload.result);
    //   }
    // });
    //
    // teacher.send({message: 'EndCall'});
    //
    // const RCD = app.get('models').RollCallDetail;
    // const RC = app.get('models').RollCall;
    // const User = app.get('models').User;
    // let s1Result = RCD.findOne({include: [
    //   {model: User, where: {id: data.s1.id}},
    //   {model: RC, where: {id: data.rollcall.id}}
    // ]});
    // let s2Result = RCD.findOne({include: [
    //   {model: User, where: {id: data.s2.id}},
    //   {model: RC, where: {id: data.rollcall.id}}
    // ]});
    //
    // assert.becomes(s1Result, 'attend');
    // assert.becomes(s1Result, 'absent');
    //
    // teacher.close();
    // s1.close();
    // s2.close();
  });

});
