const BaseController = require('../../core/base_controller')

class RoleController extends BaseController {
  async list() {
    const { ctx, service } = this
    // 角色列表不会太多，不需要分页
    const roles = await service.system.role.findAll()
    this.success(roles)
  }

  async delete() {
    const { ctx, service } = this
    const rules = {
      id: 'number'
    }
    ctx.validate(rules)
    const { id } = ctx.request.body
    await service.system.role.destroy({ id })
    this.success()
  }

  async create() {
    const { ctx, service } = this
    const rules = {
      name: 'string',
      remark: 'string?'
    }
    ctx.validate(rules)
    const { name, remark } = ctx.request.body
    await service.system.role.create({ name, remark })
    this.success()
  }

  async userList() {
    const { ctx, service } = this
    const rules = {
      role_id: 'string'
    }
    ctx.validate(rules,ctx.query)
    const { role_id } = ctx.query
    const rt = await service.system.userRole.getUsers(role_id)
    this.success(rt)
  }

  /**
   *获取某个角色下的资源
   *
   * @memberof RoleController
   */
  async resource() {
    const { ctx, service } = this
    const rules = {
      role_id: 'string'
    }
    ctx.validate(rules,ctx.query)
    const { role_id } = ctx.query
    const rt = await service.system.role.getResources(role_id)
    this.success(rt)
  }
}

module.exports = RoleController
