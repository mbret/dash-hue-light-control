#!/usr/bin/env node
const argv = require('yargs').argv
const watcher = require('./lib/watcher')
const configLoader = require('./lib/config-loader')

// args check
if (!argv.settings) {
  console.log('Provide --settings arg')
  process.exit()
}

// run watcher
watcher(configLoader.load(argv.settings))