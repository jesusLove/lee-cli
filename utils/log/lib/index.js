'use strict';


const log = require('npmlog')
// 判断 Debug 模式
log.level = process.env.LOG_LEVEL ? process.env.LOG_LEVEL : 'info'
// 添加自定义
log.heading = 'lee'
log.headingStyle = { bg: 'green', fg: 'white', bold: true }
// 自定义 log
// log.addLevel('success', 2500, {fg: 'red'})

module.exports = log;