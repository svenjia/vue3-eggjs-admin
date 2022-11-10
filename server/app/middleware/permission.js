'use strict'
const _ = require('lodash')

module.exports = () => {
  return async function (ctx, next) {
    let url = ctx.request.path
    const method = ctx.request.method
    console.log(ctx.request,url, method, ctx.get('referer'))
    const whitelist = ['/api/system/user/resource', '/api/system/user/sign_out']
    //  测试状态直接return
    return await next()

    if (url === '/api/system/user/sign_in') {
      // 登录接口不做限制
      return await next()
    }
    // 如果不是登录接口，需验证session
    // 检测session是否为null or undefined
    if (_.isNil(ctx.session.user)) {
        ctx.status = 401
      // ctx.redirect('/login')
      return
    }
    if (whitelist.some((item) => item === url)) {
      // 在白名单不检测
      return await next()
    }

    url = url.slice(4)
    // 检测session是否为null or undefined

    const userId = ctx.session.user.id
    console.log(ctx.session.user)
    // 单点登录
    if (ctx.app.config.login.singleLogin) {
      const sessionId = ctx.app.sessionMap.has(userId) ? ctx.app.sessionMap.get(userId) : -1
      if (sessionId !== ctx.session.id) {
        ctx.session = null
        ctx.status = 401
        return
      }
    }

    const user = await ctx.service.system.user.findOne({
      id: userId
    })

    if (user?.is_admin === 1) {
      // 是否有超级管理员租
      return await next()
    }

    const hasPermission = await ctx.service.system.user.hasPermission({
      userId,
      url,
      method
    })
    console.log(userId, url, method, hasPermission)
    if (!hasPermission) {
      ctx.status = 403
    } else {
      await next()
    }
  }
}
