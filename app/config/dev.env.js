'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // 开发环境api请求
  API_URL: '"http://192.168.2.192:4000/api/v3"',
  SOCKET_URL: '"http://192.168.2.192:4000/market"'
})
