const cache = require('../cache');
const dt = require('../repositories/dingtalk');
const { timeout } = require('../constants');

const getToken = async (appKey, appSecret) => {
  const token = await cache.getValue(`dingtalk:token:${appKey}`, {
    func: dt.getAccessToken,
    params: [appKey, appSecret],
    timeout: timeout.short,
  });
  return token;
};

const getUserid = async (appKey, appSecret, unionid) => {
  const token = await getToken(appKey, appSecret);
  const userid = await dt.getUserid(token, unionid);
  return userid;
};

const getMobileByUID = async (appKey, appSecret, userid) => {
  const token = await getToken(appKey, appSecret);
  const mobile = await dt.getMobile(token, userid);
  return mobile;
};

module.exports = class Dingtalk {
  constructor(appKey, appSecret) {
    this.appKey = appKey;
    this.appSecret = appSecret;
  }

  async unionid(tmpcode, callbakurl) {
    const code = await dt.getLoginCode(this.appKey, tmpcode, callbakurl);
    const unionid = await dt.getUnionid(this.appKey, this.appSecret, code);
    return unionid;
  }

  async mobileByUID(userid) {
    const mobile = await cache.getValue(`dingtalk:mobile:${userid}`, {
      func: getMobileByUID,
      params: [this.appKey, this.appSecret, userid],
      timeout: timeout.long,
    });
    return mobile;
  }

  async mobileByUnionid(unionid) {
    const userid = await cache.getValue(`dingtalk:userid:${this.appKey}:${unionid}`, {
      func: getUserid,
      params: [this.appKey, this.appSecret, unionid],
      timeout: timeout.long,
    });
    const mobile = await this.mobileByUID(userid);
    return mobile;
  }

  async userid(code) {
    const token = await getToken(this.appKey, this.appSecret);
    const userid = dt.getUseridByCode(token, code);
    return userid;
  }
};
