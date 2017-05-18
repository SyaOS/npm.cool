'use strict'

const _ = require('lodash')
const superagent = require('superagent')
const debug = require('debug')('npm.cool')

const API_KEY = process.env.WORDNIK_KEY

module.exports = async (ctx, name) => {
  const url = `https://api.wordnik.com/v4/word.json/${name}/relatedWords`
  try {
    const response = await superagent.get(url)
      .query({
        'useCanonical': true,
        'api_key': API_KEY
      })
    ctx.body = _(response.body)
      .map('words')
      .flatten()
      .map(_.kebabCase)
      .sortBy()
      .sortedUniq()
      .value()
  } catch (error) {
    debug(url)
    debug(error)
    ctx.statusCode = 502
  }
}
