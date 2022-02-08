const crypto = require('crypto');
const { request } = require('undici');

module.exports.signature = (appSecret, timestamp) => {
  const hmac = crypto.createHmac('sha256', appSecret);
  hmac.update(`${timestamp}`);
  return encodeURIComponent(hmac.digest('base64'));
};

module.exports.getAccessToken = async (appKey, appSecret) => {
  const { body } = await request(`https://oapi.dingtalk.com/gettoken?appkey=${appKey}&appsecret=${appSecret}`);
  return (await body.json()).access_token;
};

module.exports.getLoginCode = async (appKey, tempcode, callbakurl) => {
  const { headers } = await request(
    `https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=${appKey}&response_type=code&scope=snsapi_login&state=STATE&redirect_uri=${encodeURIComponent(
      callbakurl,
    )}&loginTmpCode=${tempcode}`,
  );
  const code = new URL(headers.location).searchParams.get('code');
  return code;
};

module.exports.getUnionid = async (appKey, appSecret, code) => {
  const now = Date.now();
  const { body } = await request(
    `https://oapi.dingtalk.com/sns/getuserinfo_bycode?signature=${this.signature(
      appSecret,
      now,
    )}&timestamp=${now}&accessKey=${appKey}`,
    {
      method: 'POST',
      body: JSON.stringify({ tmp_auth_code: code }),
    },
  );
  return (await body.json()).user_info.unionid;
};

module.exports.getUserid = async (token, unionid) => {
  const { body } = await request(`https://oapi.dingtalk.com/topapi/user/getbyunionid?access_token=${token}`, {
    method: 'POST',
    body: JSON.stringify({ unionid }),
  });
  return (await body.json()).result.userid;
};

module.exports.getUseridByCode = async (token, code) => {
  const { body } = await request(`https://oapi.dingtalk.com/topapi/v2/user/getuserinfo?access_token=${token}`, {
    method: 'POST',
    body: JSON.stringify({ code }),
  });
  return (await body.json()).result.userid;
};

module.exports.getMobile = async (token, userid) => {
  const { body } = await request(`https://oapi.dingtalk.com/topapi/v2/user/get?access_token=${token}`, {
    method: 'POST',
    body: JSON.stringify({ userid }),
  });
  return (await body.json()).result.mobile;
};
