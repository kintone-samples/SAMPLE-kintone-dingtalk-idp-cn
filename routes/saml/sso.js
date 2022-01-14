const express = require('express')

const router = express.Router()
const kt = require('../../core/proxies/kintone')
const { asyncParseRequest } = require('../../core/constants')

const sso = async (req, res) => {
  try {
    const data = await asyncParseRequest(req)
    const domain = new URL(data.issuer).host
    const setting = await kt.setting(domain)
    res.render('sso', { appKey: setting.appKey, callback: setting.callback, SAMLRequest: req.query.SAMLRequest })
  } catch (e) {
    res.status(500).send('Invalid sso request')
  }
}

router.get('/', sso)
router.post('/', sso)

module.exports = router
