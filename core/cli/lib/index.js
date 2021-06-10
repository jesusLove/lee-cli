'use strict';

module.exports = core;

// ! require 加载文件类型：.js/.json/.node(C++)
// ? .js -> module.exports/exports
// ? .json -> JSON.parse
// * .any -> 当成 .js 解析
const pkg = require('../package.json')
const log = require('@lee/log')

function core() {
  checkPkgVersion()
}

function checkPkgVersion() {
  console.log(pkg.version)

  log()
}


