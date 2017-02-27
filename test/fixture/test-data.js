const Promise = require('bluebird');
const moment = require('moment');

const now = moment().format('YYYY-MM-DD HH:mm:ss');

const teacher = {id: 1, name: '黄亮', nickName: '黄亮', wxUnionId: 'o1fD50E-KyabcumCwsQUl_rqQgEs', avatarUrl: 'http://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eoOpbWQlzkHQuvE5z1Atb4Mw6sE3vLXn0FAyNuoibic3mSD0sS40NvNan1S4meib6TtNicUcWT7hCD35g/0', createdAt: now, updatedAt: now};
const s1 = {id: 2, name: '莫子骞', nickName: '莫子骞', wxUnionId: '', avatarUrl: 'https://s3.amazonaws.com/uifaces/faces/twitter/sunshinedgirl/128.jpg', createdAt: now, updatedAt: now};
const s2 = {id: 3, name: '张扬', nickName: '张扬', wxUnionId: '', avatarUrl: 'https://s3.amazonaws.com/uifaces/faces/twitter/sunshinedgirl/128.jpg', createdAt: now, updatedAt: now};
const s3 = {id: 4, name: '李晓峰', nickName: '李晓峰', wxUnionId: '', avatarUrl: 'https://s3.amazonaws.com/uifaces/faces/twitter/sunshinedgirl/128.jpg', createdAt: now, updatedAt: now};

const createdClass = {id: 1, name: '物流管理基础一班', createdAt: now, updatedAt: now};
const joinedClass = {id: 100, name: '学生班', createdAt: now, updatedAt: now};

const rollcall = {id: 2, name: '15:00的点名', ownerId: 1, classId: 1, status: 'ongoing', createdAt: now, updatedAt: now};

function populateData(sequelize) {
  return sequelize.query(
    `insert into users (id, name, avatarUrl, nickName, wxUnionId, createdAt, updatedAt) values
      (${teacher.id}, '${teacher.name}', '${teacher.avatarUrl}', '${teacher.nickName}', '${teacher.wxUnionId}', '${teacher.createdAt}', '${teacher.updatedAt}'),
      (${s1.id}, '${s1.name}', '${s1.avatarUrl}', '${s1.nickName}', '${s1.wxUnionId}', '${s1.createdAt}', '${s1.updatedAt}'),
      (${s2.id}, '${s2.name}', '${s2.avatarUrl}', '${s2.nickName}', '${s2.wxUnionId}', '${s2.createdAt}', '${s2.updatedAt}'),
      (${s3.id}, '${s3.name}', '${s3.avatarUrl}', '${s3.nickName}', '${s3.wxUnionId}', '${s3.createdAt}', '${s3.updatedAt}')
      `).then(() => {
    return sequelize.query(
      `insert into classes (id, name, createdAt, updatedAt) values
        (${createdClass.id}, '${createdClass.name}', '${createdClass.createdAt}', '${createdClass.updatedAt}'),
        (${joinedClass.id}, '${joinedClass.name}', '${joinedClass.createdAt}', '${joinedClass.updatedAt}')
        `);
  }).then(() => {
    return sequelize.query(
      `insert into users_classes (role, userId, classId, createdAt, updatedAt) values
        ('owner', ${teacher.id}, ${createdClass.id}, '${now}', '${now}'),
        ('student', ${s1.id}, ${createdClass.id}, '${now}', '${now}'),
        ('student', ${s2.id}, ${createdClass.id}, '${now}', '${now}'),
        ('student', ${s3.id}, ${createdClass.id}, '${now}', '${now}'),
        ('student', ${teacher.id}, ${joinedClass.id}, '${now}', '${now}')`);
  }).then(() => {
    return sequelize.query(
      `insert into rollcalls (id, name, status, classId, ownerId, createdAt, updatedAt) values
        (1, '14:00的点名', 'todo', 1, 1, now(), now()),
        (${rollcall.id}, '${rollcall.name}', '${rollcall.status}', ${rollcall.classId}, ${rollcall.ownerId}, '${rollcall.createdAt}', '${rollcall.updatedAt}'),
        (3, '16:00的点名', 'done', 1, 1, now(), now()),
        (4, '10:00的点名', 'todo', 100, 2, DATE_SUB(now(), interval 1 day), DATE_SUB(now(), interval 1 day)),
        (5, '11:00的点名', 'ongoing', 100, 2, DATE_SUB(now(), interval 1 day), DATE_SUB(now(), interval 1 day)),
        (6, '13:00的点名', 'done', 100, 2, DATE_SUB(now(), interval 1 day), DATE_SUB(now(), interval 1 day))`);
  });
}

function cleanData(sequelize) {
  return sequelize.query(
    `delete from rollcalls;`
  ).then(() => {
    return sequelize.query(
      `delete from users_classes;`
    );
  }).then(() => {
    return sequelize.query(
      `delete from classes;`
    );
  }).then(() => {
    return sequelize.query(
      `delete from users;`
    );
  });
}

module.exports = {
  populateData: populateData,
  cleanData: cleanData,
  data: {
    teacher: teacher,
    s1: s1,
    s2: s2,
    s3: s3,
    createdClass: createdClass,
    joinedClass: joinedClass,
    rollcall: rollcall
  }
}
