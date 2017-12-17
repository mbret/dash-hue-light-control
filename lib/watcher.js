const HueControlHelper = require('./hue-control-helper')
const dash_button = require('node-dash-button')
const hue = require('node-hue-api')

/**
 * Watcher
 * @param logger
 * @param settings
 */
module.exports = (logger, settings) => {

  const hueControlHelper = HueControlHelper(new hue.HueApi(settings.bridge, settings.jwt))
	
	
	settings.configuration.forEach(config => {
	  logger.info(`Found configuration for ${config.dash}`)

		configure(config);
	})




	function configure(settings){
		let dash = loadButton(settings.dash)
		let toggle = false;
		logger.info(`Listening for dash button with mac address: ${settings.dash}`)
		if(settings.mode === 'toggle'){toggle = true;}
		
		
		if(settings.target === 'light'){
			createLightListener(settings.Id, dash, toggle);
		}else if(settings.target === 'group'){
			createGroupListener(settings.Id, dash, toggle);
		}else{
			console.log("no light or groups configured")
		}    

	}
	
	function createLightListener(lightId, dash, toggle){
			// Main listener
			// Every dash press action will trigger this event
			// Each time we lookup the state of the light and apply
			// the desired action
		dash.on('detected', function () {
			hueControlHelper.getLight(lightId, (err, light) => {
				if (err) {
					onUnexpectedError(err)
				}

				logger.info('Dash detected')
				// toggle mode on/off
				if (toggle) {
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
	}
	
	function createGroupListener(groupId, dash, toggle){
		dash.on('detected', function () {
			hueControlHelper.getGroup(groupId, (err, group) => {
				if (err) {
					onUnexpectedError(err)
				}

				logger.info('Dash detected')
				// toggle mode on/off
				if (toggle) {
					console.log(group.state);
					if (group.state.any_on) {
						logger.info(`Group is currently ${hueControlHelper.getGroupStateLabel(group.state)}, turing it off`)
						hueControlHelper.turnOffGroup(group, onLightStateChange(group.state))
					} else {
						logger.info(`Group is currently ${hueControlHelper.getGroupStateLabel(group.state)}, turing it on`)
						hueControlHelper.turnOnGroup(group, onLightStateChange(group.state))
					}
				}

				// only turn on
				if (settings.mode === 'on') {
					if (!group.state.all_on) {
						logger.info(`group is currently ${group.state}, turing it on`)
						hueControlHelper.turnOnGroup(group, onLightStateChange(group.state))
					}
				}

				// only turn off
				if (settings.mode === 'off') {
					if (group.state.any_on) {
						logger.info(`group is currently ${hueControlHelper.getStateLabel(group.state)}, turing it off`)
						hueControlHelper.turnOffGroup(group, onLightStateChange(group.state))
					}
				}
			})
		})
	}
	
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