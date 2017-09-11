#!/usr/bin/env node
const argv = require('yargs').argv
const watcher = require('./lib/watcher')
const configLoader = require('./lib/config-loader')

// args check
if (!argv.settings) {
  console.log('Argument --settings is missing. Please provide --settings path to use this program. Exiting app...')
  process.exit()
}

// run watcher
watcher(configLoader.load(argv.settings))