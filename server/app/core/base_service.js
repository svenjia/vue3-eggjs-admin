'use strict'

const Service = require('egg').Service

class BaseService extends Service {
  /**
   *Creates an instance of BaseService.
   * @param {*} ctx ctx
   * @param {*} dbName 数据库名字
   * @param {*} tableName 表名
   * @param {*} options 参数，如果是json {single:true}  如果直接true表示单数据库模式
   * @memberof BaseService
   */
  constructor(ctx, dbName, tableName, options) {
    super(ctx)
    this.dbName = dbName
    this.tableName = tableName
    this.masterDb = this.app.mysql.get(`${this.dbName}.master`)
    this.slaveDb = this.app.mysql.get(`${this.dbName}.slave`)
    this.masterDbQuery = this.app.mysql.get(`${this.dbName}.master`)(this.tableName)
    options = options || { single: false }
    if (options || options.single) {
      this.slaveDbQuery = this.masterDbQuery
    } else {
      this.slaveDbQuery = this.app.mysql.get(`${this.dbName}.slave`)(this.tableName)
    }
  }


  // 创建数据
  /**
   *
   *
   * @param {*} data
   * @return {*} [id]
   * @memberof BaseService
   */
  async create(data) {
    return await this.masterDbQuery.insert(data)
  }



  // 修改数据
  async update(data, where = {}) {
    return await this.masterDbQuery.update(data).where(where)
  }

  //  options = [{
  //   row: {
  //     email: 'm@fengmk2.com',
  //     otherField: 'other field value',
  //     modifiedAt: db.literals.now, // `now()` on db server
  //   },
  //   where: {
  //     id: 123,
  //     name: 'fengmk2',
  //   }
  // }, {
  //   row: {
  //     email: 'm@fengmk2_2.com',
  //     otherField: 'other field value2',
  //     modifiedAt: db.literals.now, // `now()` on db server
  //   },
  //   where: {
  //     id: 124,
  //     name: 'fengmk2_2',
  //   }
  // }]
  async updateRows(options) {
    console.log(options)
    const trx = await this.masterDb.transaction()
    try {
      await Promise.all(
        options.map((tuple) =>
          this.masterDbQuery.clone().where(tuple.where).update(tuple.row).transacting(trx)
        )
      )
      await trx.commit()
      return 0
    } catch (error) {
      await trx.rollback()
    }
  }

  // 删除数据
  async destroy(where = {}) {
    return await this.masterDbQuery.delete().where(where)
  }

  // 查找一个
  async findOne(where = {}) {
    return await this.slaveDbQuery.first().where(where)
  }

  // 查找所有
  // * @param  {String} table     table name
  // * @param  {Object} [options] optional params
  // *  - {Object} where          query condition object
  // *  - {Array|String} columns  select columns, default is `'*'`
  // *  - {Array|String} orders   result rows sort condition
  // *  - {Number} limit          result limit count, default is no limit
  // *  - {Number} offset         result offset, default is `0`
  // * @return {Array} result rows
  async findAll({ where, whereRaw, orders } = {}) {
    const query = this.slaveDbQuery.select()
    if (where) {
      query.where(where)
    }
    if (whereRaw) {
      query.whereRaw(whereRaw.raw, whereRaw.params)
    }
    if (orders) {
      query.orderBy(orders)
    }
    return await query
  }

  // count数据
  async count(where) {
    return await this.slaveDbQuery.count('*').where(where)
  }
  async countDistinct(field, where) {
    return await this.slaveDbQuery.countDistinct(field).where(where)
  }

  // 显示列表，分页显示

  /**
   *
   *
   * @param {*} { page, pageSize, where, columns, orders }
   * @param {orders} [
  { column: 'email' }, 
  { column: 'age', order: 'desc' }
    ]
   * @return {*} 
   * @memberof BaseService
   */
  async list({ page, pageSize, where, whereRaw, columns, orders, jsonContain = [] }) {
    const query = this.slaveDbQuery
    if (columns) {
      query.select(columns)
    } else {
      query.select()
    }
    if (where) {
      query.where(where)
    }
    if (whereRaw) {
      query.whereRaw(whereRaw.raw, whereRaw.params)
    }
    if (jsonContain.length > 0) {
      jsonContain.forEach((item) => {
        query.whereJsonSupersetOf(item.field, item.json)
      })
    }
    if (orders) {
      query.orderBy(orders)
    }
    const { data, pagination } = await query.paginate({
      isLengthAware: true,
      currentPage: page,
      perPage: pageSize
    })
    return {
      list: data,
      total: pagination?.total
    }
  }

  /**
   * @description
   * @param {*} data 一般是集合数据
   * @memberof BaseService
   */
  async replaceAll(data, where = {}) {
    try {
      await this.masterDb.transaction(async (trx) => {
        await trx(this.tableName).delete().where(where)
        await trx(this.tableName).insert(data)
      })
    } catch (error) {
      this.ctx.logger.error('执行replaceAll事务发生错误', error)
    }
  }
}

module.exports = BaseService
