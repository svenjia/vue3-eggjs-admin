/* eslint valid-jsdoc: "off" */

'use strict'
const path = require('path')

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = (appInfo) => {
  const config = (exports = {})
  config.mysql = require('./prod/config.mysql.js')
  config.s3 = require('./prod/config.s3.js')
  return {
    ...config
  }
}
