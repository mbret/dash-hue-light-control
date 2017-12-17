const hue = require('node-hue-api')

/**
 * @param {Object} hueApi
 */
module.exports = (hueApi) => {

  const lightState = hue.lightState
  const stateHandler = lightState.create()

  /**
   *
   * @param id
   * @param cb
   */
  const getLight = (id, cb) => {
    hueApi.lights(function (err, lights) {
      if (err) {
        return cb(err)
      }

      // lookup state
      let light = null
      lights['lights'].forEach(entry => {
        if (id === entry.id) {
          light = entry
        }
      })

      return cb(null, light)
    })
  }
  
	  /**
   *
   * @param id
   * @param cb
   */
  const getGroup = (id, cb) => {
    hueApi.groups(function (err, groups) {
      if (err) {
        return cb(err)
      }

      let group= null
      groups.forEach(entry => {
		  
        if (id === entry.id) {
          group = entry
        }
      })
	  
      return cb(null, group)
    })
  }

  /**
   *
   * @param light
   * @param cb
   */
  const turnOn = (light, cb) => {
    hueApi.setLightState(light.id, stateHandler.on(), function (err, result) {
      if (err) {
        return cb(err)
      }
      return cb(null, result)
    })
  }

  /**
   *
   * @param light
   * @param cb
   */
  const turnOff = (light, cb) => {
    hueApi.setLightState(light.id, stateHandler.off(), function (err, result) {
      if (err) {
        return cb(err)
      }
      return cb(null, result)
    })
  }
	
   /**
   *
   * @param group
   * @param cb
   */
	const turnOnGroup = (group, cb) => {
    hueApi.setGroupLightState(group.id, stateHandler.on(), function (err, result) {
      if (err) {
        return cb(err)
      }
      return cb(null, result)
    })
  }

  /**
   *
   * @param group
   * @param cb
   */
  const turnOffGroup = (group, cb) => {
    hueApi.setGroupLightState(group.id, stateHandler.off(), function (err, result) {
      if (err) {
        return cb(err)
      }
      return cb(null, result)
    })
  }

  /**
   *
   * @param state
   * @returns {string}
   */
  const getStateLabel = (state) => {
    return state.on ? 'on': 'off'
  }
	
	  /**
   *
   * @param state
   * @returns {string}
   */
  const getGroupStateLabel = (state) => {
		if(state.all_on){
			return "all on";
		}else if(state.any_on){
			return "partially on";
		}else{
			return "all off"
		}
  }

  return {
    getLight,
    turnOn,
    turnOff,
		getGroup,
    turnOnGroup,
    turnOffGroup,
    getStateLabel,
		getGroupStateLabel
  }
}