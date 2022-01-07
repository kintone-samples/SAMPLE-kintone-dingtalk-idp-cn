const crypto = require('crypto');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const cache = require('../cache')
const { agent } = require('../constants')

const getAccessToken = async(appKey,appSecret)=>{
  const response = await fetch(`https://oapi.dingtalk.com/gettoken?appkey=${appKey}&appsecret=${appSecret}`)
  const data = await response.json();
  return data.access_token
}

module.exports = class Dingtalk {
    constructor(appKey,appSecret){
        this.appKey = appKey
        this.appSecret = appSecret
        cache.set(`token:${appKey}:${appSecret}`,{
          get:getAccessToken,
          params:[appKey,appSecret],
          timeout:7200
        })
    }

    signature(timestamp){
        const hmac = crypto.createHmac('sha256', this.appSecret)
        hmac.update(`${timestamp}`);
        return encodeURIComponent(hmac.digest('base64'))
    }

    async getLoginCode(tempcode,callbakurl) {
        const url = `https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=${this.appKey}&response_type=code&scope=snsapi_login&state=STATE&redirect_uri=${encodeURIComponent(callbakurl)}&loginTmpCode=${tempcode}`
        const response = await fetch(url,{redirect: 'manual',agent});
        const code = new URL(response.headers.get('location')).searchParams.get('code')
        return code
    }

    async getUnionid(tmp_auth_code){
        const now = Date.now()
        const obj = {
          tmp_auth_code,
        }
        const response = await fetch(`https://oapi.dingtalk.com/sns/getuserinfo_bycode?signature=${this.signature(now)}&timestamp=${now}&accessKey=${this.appKey}`, 
        { 
          method: 'POST',
          body: JSON.stringify(obj),
          agent
        });
        const data = await response.json();
        return data.user_info.unionid
    }

    async getUserid(unionid){
      const token = await cache.get(`token:${this.appKey}:${this.appSecret}`)
      const obj = {
        unionid,
      }
      const response = await fetch(`https://oapi.dingtalk.com/topapi/user/getbyunionid?access_token=${token}`, 
      { 
        method: 'POST',
        body: JSON.stringify(obj),
        agent
      });
      const data = await response.json();
      return data.result.userid
    }

    async getMobile(userid){
      const token = await cache.get(`token:${this.appKey}:${this.appSecret}`)
      const obj = {
        userid,
      }
      const response = await fetch(`https://oapi.dingtalk.com/topapi/v2/user/get?access_token=${token}`, 
      { 
        method: 'POST',
        body: JSON.stringify(obj),
        agent
      });
      const data = await response.json();
      return data.result.mobile
    }
    
}