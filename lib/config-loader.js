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
    if (!config.dash) {
      invalidEntryError.message = `Entry 'dash' is missing from your setting file. Please provide a valid value`
      throw invalidEntryError
    }

    return config
  }

  return {
    load
  }
}