#!/usr/bin/env node

const cli = require('../lib/cli')
const {version} = require('../package.json')
// we want to use main program api to ensure it always work depending the
// context
const dashHueLightControl = require('../index')({
  log: true
})

// Run main program cli
cli(dashHueLightControl, {version})

