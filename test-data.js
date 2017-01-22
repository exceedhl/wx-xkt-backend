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
const Class = app.get('models').Class;
const User = app.get('models').User;
const UserClass = app.get('models').UserClass;
const RollCall = app.get('models').RollCall;
const RollCallDetail = app.get('models').RollCallDetail;

for (var i = 0; i < 50; i++) {
  User.create({
    name: faker.fake('{{name.firstName}}{{name.lastName}}'),
    age: faker.random.number({min:15, max:40}),
    gender: faker.random.arrayElement(['Male', 'Female']),
    avatarUrl: faker.internet.avatar(),
    nickName: faker.hacker.noun()
  })
}

User.create({
  name: faker.fake('{{name.firstName}}{{name.lastName}}'),
  age: faker.random.number({min:15, max:40}),
  gender: faker.random.arrayElement(['Male', 'Female']),
  avatarUrl: faker.internet.avatar(),
  nickName: faker.hacker.noun()
}).then((user) => {
  user.createOwnClass({name: '物流管理基础一班'});
  user.createOwnClass({name: '物流管理基础二班'});
})
