var express = require('express');
var router = express.Router();
const settings = require('../../core/settings')
const Dingtalk = require('../../core/repositories/dingtalk')
const Kintone = require('../../core/repositories/kintone')

/* GET home page. */
router.get('/', async function(req, res, next) {
    const tempcode = req.query.loginTmpCode
    const domain = req.query.d
    const setting = await settings.get(domain)
    const dt = new Dingtalk(setting.appKey,setting.appSecret)
    const kt = new Kintone({domain,appid:setting.appid,token:setting.token})
    const code = await dt.getLoginCode(tempcode,setting.callback)
    const unionid = await dt.getUnionid(code)
    const uid = await dt.getUserid(unionid)
    const mobile = await dt.getMobile(uid)
    const loginName = await kt.getLoginName(mobile)
    res.send({loginName});
});

module.exports = router;
