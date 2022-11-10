'use strict'

const crypto = require('crypto')
const fs = require('fs')
const path = require('path')
// md5 hash
const md5 = (input, salt) => {
  if (salt !== undefined) {
    input = input + salt
  }
  return crypto.createHash('md5').update(input).digest('hex')
}

const fileMd5 = (url) => {
  return new Promise((resolve) => {
    const md5sum = crypto.createHash('md5')
    const stream = fs.createReadStream(url)
    stream.on('data', function (chunk) {
      md5sum.update(chunk)
    })
    stream.on('end', function () {
      const result = md5sum.digest('hex')
      resolve(result)
    })
  })
}

const hash = (data, salt) => {
  const key = crypto.pbkdf2Sync(data, salt, 100000, 64, 'sha256')
  return key.toString('hex')
}

const getSalt = () => {
  const buf = crypto.randomBytes(16)
  return buf.toString('hex')
}

/**
 * 用于扁平化资源
 * @param {*} array
 * @returns
 */
function flatten(array) {
  const flattened = []
  !(function flat(array, id) {
    array.forEach(function (el) {
      const { children, ...other } = el
      flattened.push(
        Object.assign(other, {
          parent_code: id,
          is_show: other.is_show ?? 1
        })
      )
      if (children) {
        flat(el.children, el.code)
      }
    })
  })(array)
  return flattened
}


module.exports = {
  flatten,
  hash,
  getSalt,
  fileMd5,
}
