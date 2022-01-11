const express = require('express');
const router = express.Router();
const samlp = require('samlp')
const { credentials,issuer,asyncParseRequest } = require('../core/constants')
const settings = require('../core/settings')
const Dingtalk = require('../core/repositories/dingtalk')
const Kintone = require('../core/repositories/kintone')
const PassportProfileMapper = require('../core/claims/PassportProfileMapper')

router.post('/', async function(req, res, next) {
  try {
    const data = await asyncParseRequest(req)
    const domain = new URL(data.issuer).host
    const tempcode = req.body.loginTmpCode
    const setting = await settings.get(domain)
    const dt = new Dingtalk(setting.appKey,setting.appSecret)
    const kt = new Kintone({domain,appid:setting.appid,token:setting.token})
    const code = await dt.getLoginCode(tempcode,setting.callback)
    console.log(`code:${code}`)
    const unionid = await dt.getUnionid(code)
    console.log(`unionid:${unionid}`)
    const uid = await dt.getUserid(unionid)
    console.log(`uid:${uid}`)
    const mobile = await dt.getMobile(uid)
    console.log(`mobile:${mobile}`)
    const loginName = await kt.getLoginName(mobile)

    req.user = {
      loginName,
    },
    samlp.auth({
      issuer,
      cert:       credentials.cert,
      key:        credentials.key,
      getPostURL: function (wtrealm, wreply, req, callback) {
                    return callback( null, data.assertionConsumerServiceURL)
                  },
      profileMapper: PassportProfileMapper,
      audience:   data.issuer,
      recipient:  data.assertionConsumerServiceURL
    })(req, res, next)
  } catch (e) {
    console.error(e)
    res.status(500).send('Invalid sso request')
  }
});

module.exports = router;