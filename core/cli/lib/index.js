'use strict';

module.exports = core;

// ! require 加载文件类型：.js/.json/.node(C++)
// ? .js -> module.exports/exports
// ? .json -> JSON.parse
// * .any -> 当成 .js 解析

const semver = require('semver')
const colors = require('colors')

const pkg = require('../package.json')
const constant = require('./const')
const log = require('@lee/log')

function core() {
  // try-catch 避免输入堆栈信息
  try {
    checkPkgVersion()
    checkNodeVersion()
    checkRoot()
  } catch (e) {
    log.error(e.message)
  }
}

/**
 * 权限降级，避免高级别身份创建的文件无法读写。
 */
function checkRoot() {
  const rootCheck = require('root-check')
  rootCheck()
  log.info(process.geteuid())
}

/**
 * 检查版本号
 */
function checkPkgVersion() {
  log.info(pkg.version)
}
/**
 * 检查 Node 版本号
 */
function checkNodeVersion() {
  // * 获取当前版本号
  const curVersion = process.version
  // * 最低版本号
  const lowestVersion = constant.LOWEST_NODE_VERSION
  // * 对比版本号
  if (!semver.gte(curVersion, lowestVersion)) {
    throw new Error(colors.red(`lee 需要安装 v${lowestVersion} 以上版本的 Node.js`))
  }
}

