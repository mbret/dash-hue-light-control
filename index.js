#!/usr/bin/env node

const cli = require('./lib/cli')
const {version} = require('./package.json')

// Run main program cli
cli({version})

