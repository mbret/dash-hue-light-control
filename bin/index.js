#!/usr/bin/env node

const logger = require('../lib/logger')
const cli = require('../lib/cli')
const {version} = require('../package.json')

logger.init({
  activate: true
})

// Run main program cli
cli({version})

