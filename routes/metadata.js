var express = require('express');
var router = express.Router();
const samlp = require('samlp')
const constants = require('../core/constants')

/* GET home page. */
router.get('/', function(req, res, next) {
  samlp.metadata({
    issuer:   'urn:cn:idp',
    cert:     constants.credentials.cert,
    redirectEndpointPath: '/saml/sso',
    postEndpointPath:     '/saml/sso'
  })(req, res, next)
});

module.exports = router;
