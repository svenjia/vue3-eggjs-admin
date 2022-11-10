/* eslint valid-jsdoc: "off" */

'use strict'
const path = require('path')

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = (appInfo) => {
  const config = (exports = {})

  // 服务器开放ip和端口的设置
  config.cluster = {
    listen: {
      port: 7001
    }
  }

  // 静态文件目录配置
  config.static = {
    enable: true,
    prefix: '/',
    dir: path.join(appInfo.baseDir, 'app/public'),
    maxAge: 31536000,
    cacheControl: 'no-cache'
  }

  // 对象存储
  config.objectStorage = {
    use: 's3'
  }
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1577340224343_3823'

  // 文件上传配置
  config.multipart = {
    mode: 'file',
    whitelist: ['.png', '.jpg'],
    fileSize: '5mb'
  }

  config.security = {
    csrf: {
      enable: false
    }
  }
  //   挂载到全局的中间件
  config.middleware = ['permission', 'errorHandler']

  // 日志文件配置
  config.logger = {
    consoleLevel: 'INFO',
    level: 'INFO',
    dir: path.join(__dirname, '../logs') // 保存路径为工程路径下`logs`
  }

  config.ipWhiteList = ['*'] // 用于限制登录，数组中包含*时，表示不限制任何ip登录，否则，根据数组中的ip来进行匹配

  config.proxy = true // 应用通过Nginx代理时候，配置成true，用于获取用于真实ip

  config.login = {
    singleLogin: false, // 是否开启单点登录
    loginFailureTimes: 5, // 登录最大重复次数
    nextTryLoginTime: 10 // 达到最大重试次数后，下一次登录时间
  }

  config.defaultPassword = 'a1111111' // 玩家登录的初始密码

  return {
    ...config
  }
}
