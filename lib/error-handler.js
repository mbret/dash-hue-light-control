const logger = require('./logger')

const onUnexpectedError = err => {
  logger.error('Unexpected error', err)
  process.exit()
}

module.exports = {
  onUnexpectedError
}