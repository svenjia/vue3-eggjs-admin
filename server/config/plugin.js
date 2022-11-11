'use strict'

/** @type Egg.EggPlugin */
module.exports = {
  routerPlus: {
    enable: true,
    package: 'egg-router-plus'
  },
  validate: {
    enable: true,
    package: 'egg-validate'
  },
  s3: {
    enable: true,
    package: '@eggplugin/s3'
  },
}
