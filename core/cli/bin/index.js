#! /usr/bin/env node

const importLocal = require('import-local')
// 1. importLocal 如果本地有 lee 执行本地
if (importLocal(__filename)) {
  require('npmlog').info('cli', '正在使用 lee 本地版本')
} else {
  require('../lib')(process.argv.slice(2))
}