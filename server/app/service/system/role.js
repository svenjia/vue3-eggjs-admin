const BaseService = require('../../core/base_service')

class RoleService extends BaseService {
  constructor(ctx) {
    super(ctx, 'permission', 'roles')
  }
  // 获取当前角色拥有的资源
  async getResources(role_id) {
    // const sql =
    //   'select code,parent_code,name,uri,type from resources where `code` in(select resource_code from role_resources where role_id=?)';
    // const resources = await this.slaveDb.query(sql, [ role_id ]);
    const sub = this.slaveDb('role_resources').select('resource_code').where('role_id', role_id)
    const resources = await this.slaveDb('resources')
      .select(['code', 'parent_code', 'name', 'uri', 'type'])
      .where('code', 'in', sub)
    return resources
  }
}

module.exports = RoleService
