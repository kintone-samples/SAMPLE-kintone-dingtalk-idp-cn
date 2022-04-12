const { request } = require('undici');

module.exports.getMobiles = async (domain, token, appid, loginNames) => {
  const names = loginNames.map((name) => `"${name}"`).join();
  const { body } = await request(
    `https://${domain}/k/v1/records.json?app=${appid}&query=${encodeURIComponent(`loginName in (${names})`)}&fields[0]=${encodeURIComponent('mobile')}`,
    {
      headers: {
        'X-Cybozu-API-Token': token,
      },
    },
  );
  return (await body.json()).records.map((record) => record.mobile.value);
};

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
    )}`,
    {
      headers: {
        'X-Cybozu-API-Token': token,
      },
    },
  );
  const res = await body.json();
  if (!res.records[0]) throw new Error(`Not found your domain: ${target}`);
  const obj = { domain: target };
  if (res.records[0].appid) obj.appid = res.records[0].appid.value;
  if (res.records[0].token) obj.token = res.records[0].token.value;
  if (res.records[0].appSecret) obj.appSecret = res.records[0].appSecret.value;
  if (res.records[0].appKey) obj.appKey = res.records[0].appKey.value;
  if (res.records[0].callback) obj.callback = res.records[0].callback.value;
  if (res.records[0].corpId) obj.corpId = res.records[0].corpId.value;
  if (res.records[0].agentId) obj.agentId = res.records[0].agentId.value;

  return obj;
};
