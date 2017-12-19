const {watch} = require('./lib/watcher')
const config = require('./lib/config')
const logger = require('./lib/logger')

module.exports = (configuration = {}) => {

  config.init(configuration)

  logger.init({
    activate: true
  })

  const start = () => {
    return watch()
  }

  return {
    start
  }
}