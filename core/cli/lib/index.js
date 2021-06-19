'use strict';

module.exports = core;

// ! require 加载文件类型：.js/.json/.node(C++)
// ? .js -> module.exports/exports
// ? .json -> JSON.parse
// * .any -> 当成 .js 解析

const path = require('path')
const semver = require('semver')
const colors = require('colors')
const userHome = require('user-home')
const pathExists = require('path-exists')
const pkg = require('../package.json')
const constant = require('./const')
const log = require('@lee/log')

function core() {
  // try-catch 避免输入堆栈信息
  try {
    checkPkgVersion()
    checkNodeVersion()
    checkRoot()
    checkUserHome()
    checkInputArgs()
    checkEnv()
    checkGlobalUpdate()
  } catch (e) {
    log.error(e.message)
  }
}

async function checkGlobalUpdate() {
  // 版本，包名
  const currentVersion = pkg.version
  const npmName = pkg.name
  // 获取线上版本号
  const { getNpmSemverVersion } = require('@lee/get-npm-info')
  const lastVersion = await getNpmSemverVersion(currentVersion, npmName)
  // 大于当前 version
  if (lastVersion && semver.gt(lastVersion, currentVersion)) {
    log.warn(colors.yellow(`请手动更新 ${npmName}, 当前版本：v${currentVersion}, 最新版本: v${lastVersion} 更新命令：npm install -g ${npmName}`))
  }
}

/**
 * 检查环境变量
 */
function checkEnv() {
  const dotenv = require('dotenv')
  const dotenvPath = path.join(userHome, '.env')
  if (!pathExists(dotenvPath)) {
    const config = dotenv.config({
      path: dotenvPath
    })
  }
  createDefaultConfig()
}
function createDefaultConfig() {
  const cliConfig = {
    home: userHome
  }
  if (process.env.CLI_HOME) {
    cliConfig['cliHome'] = path.join(userHome, process.env.CLI_HOME)
  } else {
    cliConfig['cliHome'] = path.join(userHome, constant.DEFAULT_CLI_HOME)
  }
  process.env.CLI_HOME_PATH = cliConfig.cliHome
}

/**
 * 检查入参和 debug 模式
 */
function checkInputArgs() {
  const minimist = require('minimist')
  const args = minimist(process.argv.slice(2))
  function checkArgs(args) {
    if (args.debug) {
      process.env.LOG_LEVEL = 'verbose'
    } else {
      process.env.LOG_LEVEL = 'info'
    }
    log.level = process.env.LOG_LEVEL
  }
  checkArgs(args)
}
/**
 * 检查用户主目录
 */
function checkUserHome() {
  // const userHome = require('os').homedir
  if (!userHome || !pathExists(userHome)) {
    throw new Error(colors.red('当前用户主目录不存在'))
  }
  log.info(userHome)
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

