const crypto = require('crypto');
const { request } = require('undici')
const cache = require('../cache')
const { timeout } = require('../constants')

const getAccessToken = async(appKey,appSecret)=>{
  const { body } = await request(`https://oapi.dingtalk.com/gettoken?appkey=${appKey}&appsecret=${appSecret}`)
  return (await body.json()).access_token
}

const getUser = async (appKey,appSecret,unionid) =>{
  const token = await cache.get(`token:${appKey}:${appSecret}`)
  const user = {}
  const { body } = await request(`https://oapi.dingtalk.com/topapi/user/getbyunionid?access_token=${token}`,{
    method: 'POST',
    body: JSON.stringify({ unionid }),
  })
  user.userid = (await body.json()).result.userid;
  const res = await request(`https://oapi.dingtalk.com/topapi/v2/user/get?access_token=${token}`,{
    method: 'POST',
    body: JSON.stringify({ userid : user.userid }),
  })
  user.mobile = (await res.body.json()).result.mobile;
  return user
}

module.exports = class Dingtalk {
    constructor(appKey,appSecret){
        this.appKey = appKey
        this.appSecret = appSecret
        cache.set(`token:${appKey}:${appSecret}`,{
          get:getAccessToken,
          params:[appKey,appSecret],
          timeout:timeout.short
        })
    }

    signature(timestamp){
        const hmac = crypto.createHmac('sha256', this.appSecret)
        hmac.update(`${timestamp}`);
        return encodeURIComponent(hmac.digest('base64'))
    }

    async getLoginCode(tempcode,callbakurl) {
        const { headers } = await request(`https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=${this.appKey}&response_type=code&scope=snsapi_login&state=STATE&redirect_uri=${encodeURIComponent(callbakurl)}&loginTmpCode=${tempcode}`)
        const code = new URL(headers.location).searchParams.get('code')
        return code
    }

    async getUnionid(tmp_auth_code){
        const now = Date.now()
        const { body } = await request(`https://oapi.dingtalk.com/sns/getuserinfo_bycode?signature=${this.signature(now)}&timestamp=${now}&accessKey=${this.appKey}`, 
        { 
          method: 'POST',
          body: JSON.stringify({ tmp_auth_code }),
        });
        return (await body.json()).user_info.unionid
    }

    async getUser(unionid) {
      const key = `user:${this.appKey}:${unionid}`
      const user = await cache.get(key)
      if (user) console.log('cache!')
      if (user) return user
      cache.set(key,{
        get:getUser,
        params:[`${this.appKey}`,`${this.appSecret}`,unionid],
        timeout:timeout.long
      })
      return await cache.get(key)
    }
}