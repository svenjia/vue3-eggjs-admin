const BaseController = require('../../core/base_controller')
class ResourceController extends BaseController {
  async list() {
    const cacheData = this.ctx.app.cacheData
    this.success(cacheData?.resources)
  }

  async assign() {
    const { ctx, service } = this
    const rules = {
      role_id: 'number',
      resources: {
        type: 'array',
        itemType: 'string'
      }
    }
    ctx.validate(rules)
    const { role_id, resources } = ctx.request.body

    const rows = resources.map((element) => {
      return {
        role_id,
        resource_code: element
      }
    })
    await service.system.roleResources.destroy({ role_id })
    await service.system.roleResources.create(rows)
    this.success()
  }
}

module.exports = ResourceController
