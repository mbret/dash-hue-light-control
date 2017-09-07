const path = require('path')

const load = (settingsPath) => {
  const configPath = path.resolve(settingsPath)
  console.log(`Retrieving config at ${configPath}`)
  return require(configPath)
}

module.exports = {
  load
}