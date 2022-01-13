const { request } = require('undici')
const cache = require('../cache')
const { timeout } = require('../constants')

const loginName = async (domain, token, appid, mobile) => {
  const { body } = await request(
    `https://${domain}/k/v1/records.json?app=${appid}&query=${encodeURIComponent(
      `mobile = "${mobile}" limit 1`,
    )}&fields[0]=${encodeURIComponent('loginName')}`,
    {
      headers: {
        'X-Cybozu-API-Token': token,
      },
    },
  )
  return (await body.json()).records[0].loginName.value
}

module.exports = class Kintone {
  constructor(info) {
    this.domain = info.domain
    this.appid = info.appid
    this.token = info.token
  }

  async getSetting(domain) {
    const { body } = await request(
      `https://${this.domain}/k/v1/records.json?app=${this.appid}&query=${encodeURIComponent(
        `domain = "${domain}" limit 1`,
      )}&fields[0]=${encodeURIComponent('appid')}&fields[1]=${encodeURIComponent(
        'token',
      )}&fields[2]=${encodeURIComponent('appSecret')}&fields[4]=${encodeURIComponent(
        'appKey',
      )}&fields[5]=${encodeURIComponent('callback')}`,
      {
        headers: {
          'X-Cybozu-API-Token': this.token,
        },
      },
    )
    const res = await body.json()
    return {
      appid: res.records[0].appid.value,
      token: res.records[0].token.value,
      appSecret: res.records[0].appSecret.value,
      appKey: res.records[0].appKey.value,
      callback: res.records[0].callback.value,
    }
  }

  async getLoginName(mobile) {
    const key = `loginName:${this.domain}:${mobile}`
    const name = await cache.get(key)
    if (name) return name
    cache.set(key, {
      get: loginName,
      params: [`${this.domain}`, `${this.token}`, `${this.appid}`, mobile],
      timeout: timeout.medium,
    })
    const value = await cache.get(key)
    return value
  }
}
