'use strict'

module.exports = (app) => {
  const { router, controller } = app
  const subRouter = router.namespace('/api/system/resource')
  subRouter.get('/list', controller.system.resource.list)
  subRouter.post('/assign', controller.system.resource.assign)
}
