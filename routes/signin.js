var express = require('express');
var router = express.Router();
const samlp = require('samlp')
const { credentials } = require('../core/constants')

router.post('/', function(req, res, next) {
  try {
    req.user = {
      userName : req.body['userName'],
      displayName: req.body['userName'],
      name: {
        familyName: 'Foo',
        givenName: 'John'
      },
      emails: [
        {
          type: 'work',
          value: 'jfoo@gmail.com'
        }
      ]
    },
    samlp.auth({
      issuer:     'urn:cn:idp',
      cert:       credentials.cert,
      key:        credentials.key,
      getPostURL: function (wtrealm, wreply, req, callback) {
                  return callback( null, 'https://cndevyjhkud.cybozu.cn/saml/acs')
                },
      audience:   'https://cndevyjhkud.cybozu.cn',
      recipient:'https://cndevyjhkud.cybozu.cn/saml/acs'
    })(req, res, next)
  } catch (e) {
    console.error(e)
    res.status(500).send('Invalid sso request')
  }
});

module.exports = router;