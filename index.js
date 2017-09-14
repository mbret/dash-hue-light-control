#!/usr/bin/env node

// we need to deactivate console as node-dash-button output data by itself -_-
// we will use another way to log data
console.error = () => {}

const program = require('commander')
const watcher = require('./lib/watcher')
const configLoader = require('./lib/config-loader')
const cli = require('./lib/cli')
let winston = require('winston');

program
  .version(require('./package.json').version)
  .usage(cli.getUsage())

program
  .command('help')
  .description('output usage information')
  .action(() => {
    program.outputHelp()
  })

program
  .command('start')
  .description('Watch for your dash button')
  .option('--settings <path>', 'settings path')
  .action((opts) => {
    // check arg
    if (!opts.settings) {
      winston.info('option --settings is is required.')
      process.exit()
    }

    let settings

    // load and check settings
    try {
      settings = configLoader.load(opts.settings)
    } catch (err) {
      if (err.code === 'MODULE_NOT_FOUND') {
        winston.info(`Unable to retrieve settings from path [${opts.settings}]. Please check that [${opts.settings}] is a correct path`)
      } else{
        winston.info(`Unable to load your settings at [${opts.settings}]. Please verify that your file is in valid json format`)
      }
      process.exit()
    }

    // run watcher
    try {
      watcher(settings)
    } catch (err) {
      winston.warn(`An unexpected error occurred. The program will stop.`, err)
    }
  })

program
  .command('*')
  .action(() => {
    winston.info('Command not found');
    program.outputHelp();
    process.exit();
  });

// must be before .parse() since
// node's emit() is immediate

if (process.argv.length === 2) {
  program.parse(process.argv);
  program.outputHelp();
  // Check if it does not forget to close fds from RPC
  process.exit();
}

program.parse(process.argv)

