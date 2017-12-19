const dash_button = require('node-dash-button')

const loadButton = dashId => {
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

module.exports = {
  loadButton
}