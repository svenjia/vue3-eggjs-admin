const BaseService = require('../../core/base_service')

class RoleResourceService extends BaseService {
  constructor(ctx) {
    super(ctx, 'permission', 'role_resources')
  }
}

module.exports = RoleResourceService
