const BaseService = require('../../core/base_service')

class ResourceService extends BaseService {
  constructor(ctx) {
    super(ctx, 'permission', 'resources')
  }
  async update(data) {
    await this.replaceAll(data)
  }
}

module.exports = ResourceService
