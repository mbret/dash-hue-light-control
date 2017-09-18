const program = require('commander')
const ConfigLoader = require('./config-loader')

module.exports = (dashHueLightControl, {version}) => {

  let logger = dashHueLightControl._logger
  let configLoader = ConfigLoader(logger)

  const getUsage = () => {
    return `<cmd> [args]`
  }

  // Main program cli def
  program
    .version(version)
    .usage(getUsage())

  // [help] command
  program
    .command('help')
    .description('output usage information')
    .action(() => {
      program.outputHelp()
    })

  // [start] command
  program
    .command('start <settingsPath>')
    .description('Watch for your dash button')
    // .option('--settings <path>', 'settings path')
    .action((settingsPath, opts) => {
      let settings

      // load and check settings
      try {
        settings = configLoader.load(settingsPath)
      } catch (err) {
        if (err.code === 'MODULE_NOT_FOUND') {
          logger.info(`Unable to retrieve settings from path [${settingsPath}]. Please check that [${settingsPath}] is a correct path`)
        } else if (err.code === 'InvalidEntry') {
          logger.info(err.message)
        } else {
          logger.info(`Unable to load your settings at [${settingsPath}]. Please verify that your file is in valid json format`)
        }
        process.exit()
      }

      // run watcher
      try {
        dashHueLightControl.start(settings)
      } catch (err) {
        if (err.code === 'MayNeedSudo') {
          logger.warn(`PcapSession may need sudo right depending on your system setup, try running with elevated privileges via 'sudo'`)
        }
        logger.warn(`An unexpected error occurred. The program will stop.`, err)
      }
    })

  // No commands
  program
    .command('*')
    .action(() => {
      logger.info('Command not found')
      program.outputHelp()
      process.exit()
    })

  // must be before .parse() since
  // node's emit() is immediate

  if (process.argv.length === 2) {
    program.parse(process.argv)
    program.outputHelp()
    // Check if it does not forget to close fds from RPC
    process.exit()
  }

  program.parse(process.argv)
}