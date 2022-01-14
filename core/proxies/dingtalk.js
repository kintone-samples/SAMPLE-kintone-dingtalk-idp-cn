const cache = require('../cache')
const dt = require('../repositories/dingtalk')
const { timeout } = require('../constants')

const getMobile = async (appKey, appSecret, unionid) => {
  const token = await cache.getValue(`dingtalk:token:${appKey}`, {
    func: dt.getAccessToken,
    params: [appKey, appSecret],
    timeout: timeout.short,
  })
  const userid = await dt.getUserid(token, unionid)
  const mobile = await dt.getMobile(token, userid)
  return mobile
}

module.exports = class Dingtalk {
  constructor(appKey, appSecret) {
    this.appKey = appKey
    this.appSecret = appSecret
  }

  async unionid(tmpcode, callbakurl) {
    const code = await dt.getLoginCode(this.appKey, tmpcode, callbakurl)
    const unionid = await dt.getUnionid(this.appKey, this.appSecret, code)
    return unionid
  }

  async mobile(unionid) {
    const mobile = await cache.getValue(`dingtalk:mobile:${this.appKey}:${unionid}`, {
      func: getMobile,
      params: [this.appKey, this.appSecret, unionid],
    })
    return mobile
  }
}
