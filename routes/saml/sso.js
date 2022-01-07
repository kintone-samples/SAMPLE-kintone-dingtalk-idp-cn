var express = require('express');
var router = express.Router();
const settings = require('../../core/settings')
const samlp = require('samlp')
const util = require('util')

const sso = async (req, res, next) => {
  try {
    const parseRequest = util.promisify(samlp.parseRequest)
    const data = await parseRequest(req)
    console.log(data)
    const domain = new URL(data.issuer).host
    const setting = await settings.get(domain)
    res.render('sso', { domain : domain, appKey : setting.appKey, callback : setting.callback,SAMLRequest : req.query.SAMLRequest });
  } catch (e) {
    res.status(500).send('Invalid sso request')
  }
}

/* GET home page. */
router.get('/', sso);
router.post('/', sso);

module.exports = router;