const { manager } = require('../constants')
const { getLoginName, getSetting } = require('../repositories/kintone')
const cache = require('../cache')

module.exports.setting = async (target) => {
  const { domain, appid, token } = manager
  const setting = await cache.getValue(`setting:${target}`, {
    func: getSetting,
    params: [domain, token, appid, target],
  })
  return setting
}

module.exports.loginName = async (target, mobile) => {
  const { domain, appid, token } = target
  const name = await cache.getValue(`loginName:${domain}:${mobile}`, {
    func: getLoginName,
    params: [domain, token, appid, mobile],
  })
  return name
}
