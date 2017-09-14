const createControl = require('./control')
const hue = require('node-hue-api')
const dash_button = require('node-dash-button')

/**
 * Watcher
 * @param settings
 */
module.exports = (settings) => {

  const HueApi = hue.HueApi
  const lightState = hue.lightState
  const api = new HueApi(settings.bridge, settings.jwt)
  const stateHandler = lightState.create()
  let dash
  try {
    dash = dash_button(settings.dash, null, 5000, 'all')
  } catch (err) {
    throw err
  }

  const control = createControl(api, stateHandler)

  console.log(`Listening for dash ${settings.dash}`)

  dash.on('detected', function () {
    console.log('Dash detected')

    control.getLight(settings.lightId, (err, light) => {
      if (err) {
        onUnexpectedError(err)
      }

      // toggle mode on/off
      if (settings.mode === 'toggle') {
        if (light.state.on) {
          console.log(`Light is currently ${control.getStateLabel(light.state)}, turing it off`)
          control.turnOff(light, onLightStateChange(light.state))
        } else {
          console.log(`Light is currently ${control.getStateLabel(light.state)}, turing it on`)
          control.turnOn(light, onLightStateChange(light.state))
        }
      }

      // only turn on
      if (settings.mode === 'on') {
        if (!light.state.on) {
          console.log(`Light is currently ${control.getStateLabel(light.state)}, turing it on`)
          control.turnOn(light, onLightStateChange(light.state))
        }
      }

      // only turn off
      if (settings.mode === 'off') {
        if (light.state.on) {
          console.log(`Light is currently ${control.getStateLabel(light.state)}, turing it off`)
          control.turnOff(light, onLightStateChange(light.state))
        }
      }
    })
  })

  function onLightStateChange (state) {
    return (err) => {
      if (err) {
        console.error(`Unexpected error when turning the light ${state.on ? 'off' : 'on'}`, err)
      } else {
        console.log(`Success`)
      }
    }
  }

  function onUnexpectedError (err) {
    console.error('Unexpected error', err)
    process.exit()
  }
}