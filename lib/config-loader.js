const path = require('path')
let winston = require('winston');

const load = (settingsPath) => {
  const configPath = path.resolve(settingsPath)
  winston.info(`Retrieving config at ${configPath}`)
  return checkSettings(require(configPath))
}

const checkSettings = (config) => {

  return config
}

module.exports = {
  load
}