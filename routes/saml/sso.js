const express = require('express');

const router = express.Router();
const kt = require('../../core/proxies/kintone');
const { asyncParseRequest } = require('../../core/constants');

const sso = async (req, res, next) => {
  try {
    const data = await asyncParseRequest(req);
    const domain = new URL(data.issuer).host;
    const setting = await kt.setting(domain);
    const ua = req.headers['user-agent'];
    if (ua && ua.includes('DingTalk')) {
      res.render('auth', { corpId: setting.corpId, SAMLRequest: req.query.SAMLRequest });
    } else {
      res.render('sso', { appKey: setting.appKey, callback: setting.callback, SAMLRequest: req.query.SAMLRequest });
    }
  } catch (e) {
    next(e);
  }
};

router.get('/', sso);
router.post('/', sso);

module.exports = router;
