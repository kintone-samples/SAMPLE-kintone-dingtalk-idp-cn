const { request } = require('undici');

module.exports.getLoginName = async (domain, token, appid, mobile) => {
  const { body } = await request(
    `https://${domain}/k/v1/records.json?app=${appid}&query=${encodeURIComponent(
      `mobile = "${mobile}" limit 1`,
    )}&fields[0]=${encodeURIComponent('loginName')}`,
    {
      headers: {
        'X-Cybozu-API-Token': token,
      },
    },
  );
  return (await body.json()).records[0].loginName.value;
};

module.exports.getSetting = async (domain, token, appid, target) => {
  const { body } = await request(
    `https://${domain}/k/v1/records.json?app=${appid}&query=${encodeURIComponent(
      `domain = "${target}" limit 1`,
    )}&fields[0]=${encodeURIComponent('appid')}&fields[1]=${encodeURIComponent('token')}&fields[2]=${encodeURIComponent('appSecret')}&fields[4]=${encodeURIComponent('appKey')}&fields[5]=${encodeURIComponent('callback')}&fields[6]=${encodeURIComponent('corpId')}`,
    {
      headers: {
        'X-Cybozu-API-Token': token,
      },
    },
  );
  const res = await body.json();
  return {
    domain: target,
    appid: res.records[0].appid.value,
    token: res.records[0].token.value,
    appSecret: res.records[0].appSecret.value,
    appKey: res.records[0].appKey.value,
    callback: res.records[0].callback.value,
    corpId: res.records[0].corpId.value,
  };
};
