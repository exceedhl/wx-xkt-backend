const Sequelize = require('Sequelize');
const faker = require('faker')
const models = require('./src/model');
const path = require('path');
const feathers = require('feathers');
const configuration = require('feathers-configuration');

faker.locale = 'zh_CN';

const app = feathers();

app.configure(configuration(path.join(__dirname, '.')));
app.configure(models);

// TODO ClassId and UserId column names in UserClass, maybe change model name to lowercase?
const ClassModel = app.get('models').Class;
const UserModel = app.get('models').User;
const UserClassModel = app.get('models').UserClass;
const RollCallModel = app.get('models').RollCall;
const RollCallDetailModel = app.get('models').RollCallDetail;

ClassModel.sync().then(function() {
  ClassModel.create({name: '物流管理基础一班'});
  ClassModel.create({name: '物流管理基础三班'});
  ClassModel.create({name: '大一三班'});
  ClassModel.create({name: '基础三班'});
}).then(() => {
  UserModel.sync().then(function() {
    for (var i = 0; i < 100; i++) {
      UserModel.create({
        name: faker.fake('{{name.firstName}}{{name.lastName}}'),
        age: faker.random.number({min:15, max:40}),
        gender: faker.random.arrayElement(['Male', 'Female']),
        avatarUrl: faker.internet.avatar(),
        nickName: faker.hacker.noun()
      })
    }
  })
}).then(() => {
  UserClassModel.sync();
}).then(() => {
  RollCallModel.sync();
}).then(() => {
  RollCallDetailModel.sync();
});
