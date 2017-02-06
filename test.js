const moment = require('moment')

moment.locale('zh-CN');
console.log(moment('2017-01-23T08:54:51.000Z').format('HH:mm'));
console.log(moment('2017-01-23T08:54:51.000Z').format('YYYY年MMM'));
console.log(moment('2017-01-23T08:54:51.000Z').format('Do'));
console.log(moment('2017-01-23T08:54:51.000Z').format('dddd'));
console.log(moment('2017-01-23T08:54:51.000Z').format('MMMM Do YYYY, h:mm:ss a'));
