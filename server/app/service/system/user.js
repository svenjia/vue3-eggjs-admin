const BaseService = require('../../core/base_service')
const { getSalt, hash } = require('../../utils/index')
class UserService extends BaseService {
  constructor(ctx) {
    super(ctx, 'permission', 'users')
  }
  async getRolesByIds(ids) {
    // const sql =
    //   'select roles.id as role_id,roles.name as role_name,user_id from roles join user_roles on roles.id=user_roles.role_id where user_roles.user_id in (?);'
    const roles = await this.slaveDb('roles')
      .join('user_roles', 'roles.id', '=', 'user_roles.role_id')
      .whereIn('user_roles.user_id', ids)
      .select(['roles.id as role_id', 'roles.name as role_name', 'user_id'])
    return roles
  }
  async hasPermission({ userId, url, method }) {
    // const sql =
    //   'select * from resources where uri=? and method=? and `code` in (select resource_code from role_resources where role_id in (select role_id from user_roles where user_id=?));'
    // const result = await this.slaveDbQuery.query(sql, [url, method, userId])
    const sub1 = this.slaveDb('user_roles').select('role_id').where('user_id', userId)
    const sub2 = this.slaveDb('role_resources').select('resource_code').where('role_id', 'in', sub1)
    const result = await this.slaveDb('resources')
      .select('id')
      .where({ uri: url, method })
      .where('code', 'in', sub2)
    return result.length > 0
  }
  async getResources(userId) {
    // const sql =
    //   'select * from resources where `code` in(select resource_code from role_resources where role_id in (select role_id from user_roles where user_id=?));'
    // const resources = await this.slaveDbQuery.query(sql, [userId])
    const sub1 = this.slaveDb('user_roles').select('role_id').where('user_id',userId)
    const sub2 = this.slaveDb('role_resources').select('resource_code').where('role_id','in',sub1)
    const resources = await this.slaveDb('resources').select().where('code','in',sub2)
    return resources
  }
  /**
   * 初始化系统的管理员账号，主要用于系统第一次初始化，或者admin账号被误删除的情况下调用
   *
   * @memberof UserService
   */
  async initAdminAccount() {
    const { ctx } = this
    const user = await this.findOne({ username: 'admin123' })
    if (user) {
      ctx.logger.info('init admin account failed,admin account is  already existed')
      return
    }
    const salt = getSalt(),
      initPassword = ctx.app.config?.defaultPassword
    ctx.logger.info(222, initPassword)
    const createUser = {
      username: 'admin123',
      password_hash: hash(initPassword, salt),
      salt,
      register_ip: ctx.ip,
      is_admin: 1
    }
    const rt = await this.create(createUser)
    if (rt&&rt.length>0) {
      ctx.logger.info('init admin account success')
    }
  }
}

module.exports = UserService
