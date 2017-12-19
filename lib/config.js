const handler = {
  get: function (target, name) {
    return target._c[name]
  }
}

let config = new Proxy({
  _c: {
    init: function (c) {
      if (!c) throw new Error('Config invalid')
      this._c = c
    }
  }
}, handler)

module.exports = config