const moment = require('moment')
const { getSalt, hash } = require('../../utils/index')
const BaseController = require('../../core/base_controller')

class UserController extends BaseController {
  async login() {
    const { ctx, service, config } = this
    const rules = {
      username: 'string',
      password: 'string'
    }
    ctx.validate(rules)
    const { username, password } = ctx.request.body
    // return this.success({ username })
    // 1、校验是否有登录ip限制
    const ipWhiteList = config.ipWhiteList
    if (!ipWhiteList.includes('*')) {
      const ip = ctx.request.ip
      if (!ipWhiteList.includes(ip)) {
        return this.failure(110, 'IP not allowed')
      }
    }
    // 2、查找数据库中是否有该玩家
    const user = await service.system.user.findOne({ username })
    if (!user) {
      ctx.logger.info('找不到账号%s:', username)
      return this.failure(100, 'can not find account')
    }
    ctx.logger.info('login user:', user)
    // 3、判断是否账号处于封禁状态
    if (user.status !== 1) {
      ctx.logger.info('用户账号状态异常，status=%s:', user.status)
      return this.failure(100, 'account status abnormal')
    }
    // 4、10分钟内，错误次数>=5次，不允许登录
    if (
      moment().diff(moment(user.db_last_try_login_time), 'minutes') <=
        config.login.nextTryLoginTime &&
      user.db_password_wrong_times >= config.login.loginFailureTimes
    ) {
      ctx.logger.info('登录时，密码错误次数限制:', user)
      return this.failure(100, 'too much wrong times')
    }
    // 5.密码判断
    const passwordHash = hash(password, user.salt)
    if (passwordHash !== user.password_hash) {
      ctx.logger.info('登录密码错误,username=%s', user.username)
      return this.failure(100, 'wrong password')
    }
    // 更新最后登录时间，非重要信息，不需await完成
    service.system.user.update(
      {
        last_login_time: moment().unix()
      },
      {
        username: user.username
      }
    )
    ctx.session.user = user
    return this.success({ username: user.username })
  }

  async create() {
    const { ctx, service, config } = this
    // 验证规则
    const rules = {
      username: 'string',
      mobile: 'string?',
      email: { type: 'email', required: false, allowEmpty: true }
    }
    ctx.validate(rules)
    const { username, email, mobile } = ctx.request.body
    // 1、先查重，是否有相同的username
    const user = await service.system.user.findOne({ username })
    if (user) {
      ctx.logger.info('创建用户时,用户名username: %s 已经存在', username)
      return this.failure()
    }
    const salt = getSalt(),
      initPassword = config?.defaultPassword
    const createUser = {
      username,
      password_hash: hash(initPassword, salt),
      email,
      mobile,
      salt,
      register_ip: ctx.ip
    }
    const rt = await service.system.user.create(createUser)
    if (rt&&rt.length>0) {
      return this.success()
    }
    return this.failure()
  }

  async list() {
    const { ctx, service } = this
    let { page, pageSize } = ctx.request.query
    page = page ? Number(page) : 1
    pageSize = pageSize ? Number(pageSize) : 20
    const users = await service.system.user.list({
      page,
      pageSize,
      orders: [{ column: 'create_time', order: 'desc' }],
      // orders: [['create_time', 'desc']],
      where: {
        deleted: 0,
        is_admin: 0
      }
    })
    // 查出玩家对应的role
    if (users?.list && users.list.length > 0) {
      const userIds = users.list.map((item) => item.id)
      const roles = await service.system.user.getRolesByIds(userIds)

      users.list.forEach((item) => {
        item.role = roles.filter((role) => role.user_id === item.id)
      })
    }
    this.success(users)
  }

  async toggle() {
    const { ctx, service } = this
    const rules = {
      id: 'number',
      status: 'number'
    }
    ctx.validate(rules)
    const { id, status } = ctx.request.body
    await service.system.user.update(
      {
        status
      },
      {
        id
      }
    )
    this.success()
  }

  async delete() {
    const { ctx, service } = this
    const rules = {
      ids: 'array'
    }
    ctx.validate(rules)
    const { ids } = ctx.request.body
    const options = ids.map((id) => {
      return {
        row: {
          deleted: 1
        },
        where: {
          id
        }
      }
    })
    await service.system.user.updateRows(options)
    this.success()
  }

  async resetPassword() {
    const { ctx, service, config } = this
    const rules = {
      id: 'number'
    }
    ctx.validate(rules)
    const { id } = ctx.request.body
    const salt = getSalt(),
      initPassword = config?.defaultPassword
    await service.system.user.update(
      {
        salt,
        password_hash: hash(initPassword, salt)
      },
      {
        id
      }
    )
    this.success()
  }

  async assignRoles() {
    const { ctx, service } = this
    const rules = {
      user_id: 'number',
      role_ids: {
        type: 'array',
        itemType: 'number'
      }
    }
    ctx.validate(rules)
    const { user_id, role_ids } = ctx.request.body
    const rows = role_ids.map((role_id) => {
      return {
        user_id,
        role_id
      }
    })

    const rt = await service.system.userRole.replaceAll(rows, { user_id })
    this.success(rt)
  }

  async resource() {
    const { service, ctx } = this
    const { id, is_admin } = ctx.session.user
    // 如果是管理员，返回全部资源
    if (is_admin) {
      const res = await service.system.resource.findAll()

      return this.success(res)
    }
    const data = await service.system.user.getResources(id)
    this.success(data)
  }

  async logout() {
    this.ctx.session.user = null;
    this.success()
  }
}

module.exports = UserController
