'use strict'

const BaseController = require('../../core/base_controller')
const fs = require('fs')
const path = require('path')
const moment = require('moment')
const { fileMd5 } = require('../../utils/index')
class AssetController extends BaseController {
  // 上传到s3
  async s3(file, filename) {
    const { app } = this
    const stream = fs.readFileSync(file.filepath)
    // 生成一个尽量唯一的key
    const { Bucket, ACL } = app.config.s3
    const params = {
      Bucket,
      ACL,
      Key: `${filename}`,
      Body: stream
    }
    // 写入到 s3
    return await app.s3.upload(params).promise()
  }

  // 文件上传
  // POST
  /* {
    "type": 'notice', // 上传图片的类型
    "reserve": '', //保留数据，原样给客户端返回
    "file": File,
  }*/
  async index() {
    const { ctx } = this
    const { type, reserve } = ctx.request.body
    try {
      const file = ctx.request.files[0]
      ctx.logger.info('上传收到原始文件：', file)
      // 生成一个尽量唯一的key
      const extname = path.extname(file.filename)
      const hash = await fileMd5(file.filepath)
      const ts = moment().unix()
      // MD5码客户端要校验文件完整性
      const filename = `${type}/${ts}-${hash}${extname}`
      // 写入到 s3

      const result = await this.s3(file, filename)

      ctx.logger.info('上传文件返回', result)
      this.success(result?.Key)
    } catch (error) {
      ctx.logger.error('上传发生错误', error)
      fs.unlink(file.filepath, () => {})
      this.failure(-1)
      await ctx.cleanupRequestFiles()
    }
  }
}

module.exports = AssetController
