var path = require('path')
var rootPath = path.resolve(__dirname + '../..')

/// environments

module.exports = {
  development: {
    root: rootPath,
    db: 'mongodb://localhost/huboter_dev'
  },
  test: {
    root: rootPath,
    db: 'mongodb://localhost/huboter_test'
  },
  production: {
    root: rootPath,
    db: process.env.MONGOHQ_URL
  }
}