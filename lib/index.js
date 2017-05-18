'use strict'

const path = require('path')

const Koa = require('koa')
const koaRoute = require('koa-route')
const koaStatic = require('koa-static')

const exists = require('./exists')
const recommends = require('./recommends')

const app = new Koa()
app.use(koaRoute.get('/exists/:name', exists))
app.use(koaRoute.get('/recommends/:name', recommends))
app.use(koaStatic(path.join(__dirname, '../static')))

if (require.main === module) {
  app.listen(process.env.PORT)
}

module.exports = app
