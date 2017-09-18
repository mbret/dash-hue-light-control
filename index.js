const Logger = require('./lib/logger')
const watcher = require('./lib/watcher')

module.exports = (settings = {}) => {

  let _logger = Logger({
    activate: !!settings.log
  })

  const start = (settings) => {
    return watcher(_logger, settings)
  }

  return {
    _logger,
    start
  }
}