const winston = require('winston')

const Logger = () => {

  let logger
  let transports = []

  const init = ({activate}) => {
    if (activate) {
      transports.push(new (winston.transports.Console)())
    }
    logger = new winston.Logger({
      level: 'info',
      transports: transports
    })
  }

  const info = (...args) => logger.info(...args)
  const warn = (...args) => logger.warn(...args)
  const error = (...args) => logger.error(...args)

  return {
    init,
    info,
    warn,
    error
  }
}

module.exports = Logger()