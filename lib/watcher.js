const createHueControlHelper = require('./hue-control-helper')
const hue = require('node-hue-api')
const dash_button = require('node-dash-button')
const logger = require('./logger');

/**
 * Watcher
 * @param settings
 */
module.exports = (settings) => {

  const HueApi = hue.HueApi
  const lightState = hue.lightState
  const api = new HueApi(settings.bridge, settings.jwt)
  const stateHandler = lightState.create()
  const hueControlHelper = createHueControlHelper(api, stateHandler)
  let dash = loadButton(settings.dash)

  logger.info(`Listening for dash button with mac address: ${settings.dash}`)

  // Main listener
  // Every dash press action will trigger this event
  // Each time we lookup the state of the light and apply
  // the desired action
  dash.on('detected', function () {
    logger.info('Dash detected')

    hueControlHelper.getLight(settings.lightId, (err, light) => {
      if (err) {
        onUnexpectedError(err)
      }

      // toggle mode on/off
      if (settings.mode === 'toggle') {
        if (light.state.on) {
          logger.info(`Light is currently ${hueControlHelper.getStateLabel(light.state)}, turing it off`)
          hueControlHelper.turnOff(light, onLightStateChange(light.state))
        } else {
          logger.info(`Light is currently ${hueControlHelper.getStateLabel(light.state)}, turing it on`)
          hueControlHelper.turnOn(light, onLightStateChange(light.state))
        }
      }

      // only turn on
      if (settings.mode === 'on') {
        if (!light.state.on) {
          logger.info(`Light is currently ${hueControlHelper.getStateLabel(light.state)}, turing it on`)
          hueControlHelper.turnOn(light, onLightStateChange(light.state))
        }
      }

      // only turn off
      if (settings.mode === 'off') {
        if (light.state.on) {
          logger.info(`Light is currently ${hueControlHelper.getStateLabel(light.state)}, turing it off`)
          hueControlHelper.turnOff(light, onLightStateChange(light.state))
        }
      }
    })
  })

  function onLightStateChange (state) {
    return (err) => {
      if (err) {
        logger.error(`Unexpected error when turning the light ${state.on ? 'off' : 'on'}`, err)
      } else {
        logger.info(`Success`)
      }
    }
  }

  function onUnexpectedError (err) {
    logger.error('Unexpected error', err)
    process.exit()
  }

  function loadButton (dashId) {
    let _old = console.error
    try {
      // we silent here console.error as this module do use it -_-
      console.error = () => {}
      let button = dash_button(dashId, null, 5000, 'all')
      console.error = _old

      return button
    } catch (err) {
      console.error = _old
      err.code = 'MayNeedSudo'
      throw err
    }
  }
}