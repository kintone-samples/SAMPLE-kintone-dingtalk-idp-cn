const express = require('express');
const router = express.Router();
const settings = require('../../core/settings')
const { asyncParseRequest } = require('../../core/constants')

const sso = async (req, res, next) => {
  try {
    const data = await asyncParseRequest(req)
    const domain = new URL(data.issuer).host
    const setting = await settings.get(domain)
    res.render('sso', { appKey : setting.appKey, callback : setting.callback, SAMLRequest : req.query.SAMLRequest });
  } catch (e) {
    res.status(500).send('Invalid sso request')
  }
}

/* GET home page. */
router.get('/', sso);
router.post('/', sso);

module.exports = router;