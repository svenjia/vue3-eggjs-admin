'use strict'

module.exports = (app) => {
  const { router, controller } = app
  const subRouter = router.namespace('/api/system/user')
  subRouter.post('/sign_in', controller.system.user.login)
  subRouter.get('/sign_out', controller.system.user.logout)
  subRouter.post('/create', controller.system.user.create)
  subRouter.get('/list', controller.system.user.list)
  subRouter.post('/toggle', controller.system.user.toggle)
  subRouter.post('/delete', controller.system.user.delete)
  subRouter.post('/reset_password', controller.system.user.resetPassword)
  subRouter.post('/assign', controller.system.user.assignRoles)
  subRouter.get('/resource', controller.system.user.resource)
}
