const constants = require('./constants')
const cache = require('./cache')
const Kintone = require('./repositories/kintone')

const getSetting = async (domain) => {
  const kintone = new Kintone(constants.manager)
  const setting = await kintone.getSetting(domain)
  return setting
}

module.exports.get = async (domain) => {
  const setting = await cache.get(`setting:${domain}`)
  if (setting) return setting
  cache.set(`setting:${domain}`, {
    get: getSetting,
    params: [domain],
    timeout: constants.timeout.short,
  })
  const value = await cache.get(`setting:${domain}`)
  return value
}
