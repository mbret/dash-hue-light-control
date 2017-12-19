const path = require('path')

module.exports = (logger) => {

  /**
   *
   * @param settingsPath
   */
  const load = (settingsPath) => {
    const configPath = path.resolve(settingsPath)
    logger.info(`Retrieving config at ${configPath}`)
    return _checkSettings(require(configPath))
  }

  /**
   *
   * @param config
   * @returns {*}
   */
  const _checkSettings = (config) => {
    let invalidEntryError = new Error()
    invalidEntryError.code = 'InvalidEntry'

    // dash mac
    if (!config.configuration) {
      invalidEntryError.message = `Configuration is missing from your settings file.`
      throw invalidEntryError
    }

    return config
  }

  return {
    load
  }
}