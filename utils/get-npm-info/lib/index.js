'use strict';

const urlJoin = require('url-join')
const axios = require('axios')
const semver = require('semver')

function getNpmInfo(npmName, registry) {
  if (!npmName) return null
  const registryUrl = registry || getDefaultRegistryUrl()
  const npmInfoUrl = urlJoin(registryUrl, npmName)
  console.log(npmInfoUrl) //lq-log
  return axios.get(npmInfoUrl).then(res => {
    if (res.status === 200) {
      return res.data
    }
  }).catch(err => {
    console.log('检测更新失败')
    // return Promise.reject(err)
  })
}
/**
 * 获取版本号数组
 * @param {*} npmName 包名
 * @param {*} registry 数据API
 * @returns 版本号数组
 */
async function getNpmVersion(npmName, registry) {
  const data = await getNpmInfo(npmName, registry)
  if (data) {
    return Object.keys(data.versions) || []
  } else {
    return []
  }
}

// 过滤掉，小于 baseVersion 的版本号
function getSemverVersions(baseVersion, versions) {
  versions = versions.filter(version => semver.gt(version, `${baseVersion}`))
    .sort((a, b) => semver.gt(a, b))
  return versions
}

async function getNpmSemverVersion(baseVersion, npmName, registry) {

  const versions = await getNpmVersion(npmName, registry)

  const newVersions = getSemverVersions(baseVersion, versions)
  if (newVersions && newVersions.length > 0) {
    return newVersions[0]
  }
  return null
}


function getDefaultRegistryUrl(isOriginal = true) {
  return isOriginal ? 'https://registry.npmjs.org' : 'https://registry.npm.taobao.org'
}


module.exports = { getNpmInfo, getNpmSemverVersion };
