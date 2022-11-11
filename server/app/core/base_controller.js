'use strict'

const { Controller } = require('egg')

class BaseController extends Controller {
  /**
   * @description
   * @param {*} code 错误代码
   * @param {*} msg 错误信息
   * @memberof BaseController
   */
  failure(code=-1, msg) {
    this.ctx.body = {
      code,
      msg
    }
  }

  /**
   * 成功数据
   *
   * @param {json} data 返回成功数据
   * @memberof BaseController
   */
  success(data) {
    this.ctx.body = {
      code: 0,
      data
    }
  }
}
module.exports = BaseController
