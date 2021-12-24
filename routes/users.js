const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// const appSecret = 'ujmW_nOpDcMDnSCdq-BgUKOC46QzJqgdGNbBn8Vb3T6-Xyp-NIX7Pnf_p3mgCpIf'
// const appKey = 'dingoyhdlvwbmahbbh4c'
// const userToken = 'i68SuuEUXsYuPpyzASw3RmgwIsPGNDfAF7YAHyms'

const managerToken = 'ND5DMUQu48S4kF34mFKg8b65Q2aOyLmAvOnStW2d'

function signature(timestamp,appSecret) {
  const hmac = crypto.createHmac('sha256', appSecret)
  hmac.update(`${timestamp}`);
  return encodeURIComponent(hmac.digest('base64'))
}

async function getManagerInfo(token) {
}

async function getUnionidByCode(tmp_auth_code){
  const now = Date.now()
  const sig = signature(now,appSecret)
  const obj = {
    tmp_auth_code,
  }
  const response = await fetch(`https://oapi.dingtalk.com/sns/getuserinfo_bycode?signature=${sig}&timestamp=${now}&accessKey=${appKey}`, 
  { 
    method: 'POST',
    body: JSON.stringify(obj)
  });
  const data = await response.json();
  return data.user_info.unionid
}

async function getAccessToken(){
  const response = await fetch(`https://oapi.dingtalk.com/gettoken?appkey=${appKey}&appsecret=${appSecret}`)
  const data = await response.json();
  return data.access_token
}

async function getUseridByUnionid(token,unionid){
  const obj = {
    unionid,
  }
  const response = await fetch(`https://oapi.dingtalk.com/topapi/user/getbyunionid?access_token=${token}`, 
  { 
    method: 'POST',
    body: JSON.stringify(obj)
  });
  const data = await response.json();
  return data.result.userid
}

async function getMobileByUserid(token,userid){
  const obj = {
    userid,
  }
  const response = await fetch(`https://oapi.dingtalk.com/topapi/v2/user/get?access_token=${token}`, 
  { 
    method: 'POST',
    body: JSON.stringify(obj)
  });
  const data = await response.json();
  console.log(data)
  return data.result.mobile
}

/* GET users listing. */
router.get('/', async function(req, res, next) {
  
  const token = await getAccessToken()
  const unionid = await getUnionidByCode(req.query.code)
  const userid = await getUseridByUnionid(token,unionid)
  const mobile = await getMobileByUserid(token,userid)
  res.send(mobile);
});

module.exports = router;
