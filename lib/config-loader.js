const path = require('path')
const logger = require('./logger')

/**
 *
 * @param settingsPath
 */
const load = (settingsPath) => {
  const configPath = path.resolve(settingsPath)
  logger.info(`Retrieving config at ${configPath}`)
  const config = require(configPath)

  return normalize(checkSettings(config))
}

const normalize = config => {
  // always use array of dash
  if (!Array.isArray(config.configuration)) config.configuration = [config.configuration]

  return config
}

/**
 *
 * @param config
 * @returns {*}
 */
const checkSettings = (config) => {
  let invalidEntryError = new Error()
  invalidEntryError.code = 'InvalidEntry'

  // dash mac
  if (!config.configuration) {
    invalidEntryError.message = `[configuration] entry is missing from your settings file.`
    throw invalidEntryError
  }

  if (typeof config.configuration !== 'object') {
    invalidEntryError.message = `[configuration] entry must be either an array or an object.`
    throw invalidEntryError
  }

  return config
}

module.exports = {
  load
}