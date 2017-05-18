'use strict'

const superagent = require('superagent')
const debug = require('debug')('npm.cool')

module.exports = async (ctx, name) => {
  const url = `https://registry.npmjs.org/${name}`
  try {
    await superagent.head(url)
    ctx.body = null
  } catch (error) {
    if (error.status === 404) {
      ctx.statusCode = 404
    } else {
      debug(url)
      debug(error)
      ctx.statusCode = 502
    }
  }
}
