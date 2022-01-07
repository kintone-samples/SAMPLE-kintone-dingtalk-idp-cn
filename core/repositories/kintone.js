const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

module.exports = class Kintone {
    constructor(info){
        this.domain = info.domain
        this.appid = info.appid
        this.token = info.token
    }

    async getSetting(domain) {
        const params = `?app=${this.appid}&query=${encodeURIComponent(`domain = "${domain}" limit 1`)}&fields[0]=${encodeURIComponent('appid')}&fields[1]=${encodeURIComponent('token')}&fields[2]=${encodeURIComponent('appSecret')}&fields[4]=${encodeURIComponent('appKey')}&fields[5]=${encodeURIComponent('callback')}`
        const response = await fetch(`https://${this.domain}/k/v1/records.json${params}`,
          { 
              headers: {
                  'X-Cybozu-API-Token': this.token,
              }
          });
        const res = await response.json()
        return {
            appid:res.records[0].appid.value,
            token:res.records[0].token.value,
            appSecret:res.records[0].appSecret.value,
            appKey:res.records[0].appKey.value,
            callback:res.records[0].callback.value,
        }
    }

    async getLoginName(mobile) {
        const params = `?app=${this.appid}&query=${encodeURIComponent(`mobile = "${mobile}" limit 1`)}&fields[0]=${encodeURIComponent('loginName')}`
        const response = await fetch(`https://${this.domain}/k/v1/records.json${params}`,
          { 
              headers: {
                  'X-Cybozu-API-Token': this.token,
              }
          });
        const res = await response.json()
        return res.records[0].loginName.value
    }
}