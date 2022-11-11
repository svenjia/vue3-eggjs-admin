const BaseService = require('../../core/base_service')

class UserRoleService extends BaseService {
  constructor(ctx) {
    super(ctx, 'permission', 'user_roles')
  }

  async getUsers(role_id) {
    // const sql =
    //   'select id, username, status from users where `id` in (select user_id from user_roles where role_id=?);';
    // const users = await this.slaveDb.query(sql, [ role_id ]);
    const sub = this.slaveDb('user_roles').select('user_id').where('role_id', role_id)
    const users = await this.slaveDb('users')
      .select(['id', 'username', 'status'])
      .where('id', 'in', sub)
    return users
  }
}

module.exports = UserRoleService
