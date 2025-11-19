const config = require('../../config/config')

const cache = {}

function set (key, value, ttl = config.cache.ttl) {
  cache[key] = {
    value,
    expiresAt: Date.now() + ttl
  }
}

function get (key) {
  const item = cache[key]

  if (!item) return null

  // chequeo de expiracion de data cacheada
  if (Date.now() > item.expiresAt) {
    delete cache[key]
    return null
  }

  return item.value
}

function clear () {
  Object.keys(cache).forEach(key => delete cache[key])
}

module.exports = { set, get, clear }
