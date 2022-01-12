const express = require('express');
const router = express.Router();
const samlp = require('samlp')
const constants = require('../core/constants')
const PassportProfileMapper = require('../core/claims/passport_profile_mapper')

/* GET home page. */
router.get('/', function(req, res, next) {
  samlp.metadata({
    issuer:   constants.issuer,
    cert:     constants.credentials.cert,
    profileMapper: PassportProfileMapper,
    redirectEndpointPath: '/saml/sso',
    postEndpointPath:     '/saml/sso'
  })(req, res, next)
});

module.exports = router;
