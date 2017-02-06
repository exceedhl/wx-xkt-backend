const faker = require('faker')
const app = require('./src/app');
const Promise = require('bluebird');

faker.locale = 'zh_CN';

// TODO ClassId and UserId column names in UserClass, maybe change model name to lowercase?
const Class = app.get('models').Class;
const User = app.get('models').User;
const UserClass = app.get('models').UserClass;
const RollCall = app.get('models').RollCall;
const RollCallDetail = app.get('models').RollCallDetail;

const sequelize = app.get('sequelize');

sequelize.query(
  `insert into users (id, name, avatarUrl, nickName, wxUnionId, createdAt, updatedAt) values
    (1, '黄亮', 'http://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eoOpbWQlzkHQuvE5z1Atb4Mw6sE3vLXn0FAyNuoibic3mSD0sS40NvNan1S4meib6TtNicUcWT7hCD35g/0', '黄亮', 'o1fD50E-KyabcumCwsQUl_rqQgEs', now(), now()),
    (2, '莫子骞', 'https://s3.amazonaws.com/uifaces/faces/twitter/sunshinedgirl/128.jpg', '莫子骞', '', now(), now())`).then(() => {
  return sequelize.query(
    `insert into classes (id, name, createdAt, updatedAt) values
      (1, '物理管理基础一班', now(), now()),
      (100, '学生班', now(), now())`);
}).then(() => {
  return sequelize.query(
    `insert into users_classes (role, userId, classId, createdAt, updatedAt) values
      ('owner', 1, 1, now(), now()),
      ('student', 1, 100, now(), now())`);
}).then(() => {
  return sequelize.query(
    `insert into rollcalls (name, status, classId, ownerId, createdAt, updatedAt) values
      ('14:00的点名', 'todo', 1, 1, now(), now()),
      ('15:00的点名', 'ongoing', 1, 1, now(), now()),
      ('16:00的点名', 'done', 1, 1, now(), now()),
      ('10:00的点名', 'todo', 100, 2, DATE_SUB(now(), interval 1 day), DATE_SUB(now(), interval 1 day)),
      ('11:00的点名', 'ongoing', 100, 2, DATE_SUB(now(), interval 1 day), DATE_SUB(now(), interval 1 day)),
      ('13:00的点名', 'done', 100, 2, DATE_SUB(now(), interval 1 day), DATE_SUB(now(), interval 1 day))`);
});

// for (var i = 0; i < 10; i++) {
//   User.create({
//     name: faker.fake('{{name.firstName}}{{name.lastName}}'),
//     avatarUrl: faker.internet.avatar(),
//     nickName: faker.hacker.noun()
//   })
// }

// User.create({
//   name: faker.fake('{{name.firstName}}{{name.lastName}}'),
//   age: faker.random.number({min:15, max:40}),
//   gender: faker.random.arrayElement(['Male', 'Female']),
//   avatarUrl: faker.internet.avatar(),
//   nickName: faker.hacker.noun()
// })

// User.findById(1).then((user) => {
//   user.createOwnClass({name: '物流管理基础一班'});
//   user.createOwnClass({name: '物流管理基础二班'});
//   return user;
// })
// User.findById(1).then(user => {
//   return Class.findAll().each(c => {
//     return user.createCreatedRollCall({name: 'rollcall 1', classId: c.get('id')});
//   })
// })
