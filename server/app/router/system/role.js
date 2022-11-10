'use strict'

module.exports = (app) => {
  const { router, controller } = app
  const subRouter = router.namespace('/api/system/role')
  subRouter.get('/list', controller.system.role.list)
  subRouter.post('/delete', controller.system.role.delete)
  subRouter.post('/create', controller.system.role.create)
  subRouter.get('/user_list', controller.system.role.userList)
  subRouter.get('/resource', controller.system.role.resource)
}
