module.exports = (api, stateHandler) => {

  /**
   *
   * @param id
   * @param cb
   */
  const getLight = (id, cb) => {
    api.lights(function (err, lights) {
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
   * @param light
   * @param cb
   */
  const turnOn = (light, cb) => {
    api.setLightState(light.id, stateHandler.on(), function (err, result) {
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
    api.setLightState(light.id, stateHandler.off(), function (err, result) {
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

  return {
    getLight,
    turnOn,
    turnOff,
    getStateLabel
  }
}