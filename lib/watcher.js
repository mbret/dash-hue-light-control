const HueControlHelper = require('./hue-control-helper')
const hue = require('node-hue-api')
const logger = require('./logger')
const config = require('./config')
const {onUnexpectedError} = require('./error-handler')
const {loadButton} = require('./hue-helpers')

const watch = () => {

  const hueControlHelper = HueControlHelper(new hue.HueApi(config.bridge, config.jwt))

  const onLightStateChange = state => err => {
    if (err) {
      logger.error(`Unexpected error when turning the light ${state.on ? 'off' : 'on'}`, err)
    } else {
      logger.info(`Success`)
    }
  }

  /**
   * Start a listening for the given dash button
   * @param dashConfig
   */
  const listenTo = dashConfig => {
    const {targetId, target, mode} = dashConfig
    let dash = loadButton(dashConfig.dash)
    let onDetected = null
    logger.info(`Listening for dash button with mac address: ${dashConfig.dash}`)

    // Create light listener
    // Every dash press action will trigger this event
    // Each time we lookup the state of the light and apply
    // the desired action
    if (target === 'light') {
      onDetected = () => hueControlHelper.getLight(targetId, processLight)
    } else if (target === 'group') {
      onDetected = () => hueControlHelper.getGroup(targetId, processGroup)
    } else {
      logger.info('no light or groups configured')
    }

    const processLight = (err, light) => {
      if (err) onUnexpectedError(err)

      // toggle mode on/off
      if (mode === 'toggle') {
        if (light.state.on) {
          logger.info(`Light is currently ${hueControlHelper.getStateLabel(light.state)}, turning it off`)
          hueControlHelper.turnOff(light, onLightStateChange(light.state))
        } else {
          logger.info(`Light is currently ${hueControlHelper.getStateLabel(light.state)}, turning it on`)
          hueControlHelper.turnOn(light, onLightStateChange(light.state))
        }
      }

      // only turn on
      if (mode === 'on') {
        if (!light.state.on) {
          logger.info(`Light is currently ${hueControlHelper.getStateLabel(light.state)}, turning it on`)
          hueControlHelper.turnOn(light, onLightStateChange(light.state))
        }
      }

      // only turn off
      if (mode === 'off') {
        if (light.state.on) {
          logger.info(`Light is currently ${hueControlHelper.getStateLabel(light.state)}, turning it off`)
          hueControlHelper.turnOff(light, onLightStateChange(light.state))
        }
      }
    }

    const processGroup = (err, group) => {
      if (err) onUnexpectedError(err)

      // toggle mode on/off
      if (mode === 'toggle') {
        if (group.state.any_on) {
          logger.info(`Group is currently ${hueControlHelper.getGroupStateLabel(group.state)}, turning it off`)
          hueControlHelper.turnOffGroup(group, onLightStateChange(group.state))
        } else {
          logger.info(`Group is currently ${hueControlHelper.getGroupStateLabel(group.state)}, turning it on`)
          hueControlHelper.turnOnGroup(group, onLightStateChange(group.state))
        }
      }

      // only turn on
      if (mode === 'on') {
        if (!group.state.all_on) {
          logger.info(`group is currently ${group.state}, turning it on`)
          hueControlHelper.turnOnGroup(group, onLightStateChange(group.state))
        }
      }

      // only turn off
      if (mode === 'off') {
        if (group.state.any_on) {
          logger.info(`group is currently ${hueControlHelper.getStateLabel(group.state)}, turning it off`)
          hueControlHelper.turnOffGroup(group, onLightStateChange(group.state))
        }
      }
    }

    dash.on('detected', () => {
      logger.info(`Dash ${dashConfig.dash} pression detected`)
      onDetected()
    })
  }

  // loop through dash configuration and listen to each
  // entries
  config.configuration.forEach(config => {
    logger.info(`Found configuration for ${config.dash}`)

    listenTo(config)
  })
}

module.exports = {
  watch
}