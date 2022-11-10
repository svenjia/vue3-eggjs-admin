'use strict'

module.exports = (app) => {
  const { router, controller } = app
  const subRouter = router.namespace('/api/common')
  subRouter.post('/upload', controller.common.upload.index)
}
