var express = require('express');
var router = express.Router();
var fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
var cache = require('memory-cache');

/* GET home page. */
router.get('/', async function(req, res, next) {
    const setting = cache.get('setting')
    const tempcode = req.query.loginTmpCode
    const url = `https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=${setting.appKey}&response_type=code&scope=snsapi_login&state=STATE&redirect_uri=${encodeURIComponent('http://localhost:3000/users/')}&loginTmpCode=${tempcode}`
    const response = await fetch(url,{redirect: 'manual'});
    const code = new URL(response.headers.get('location')).searchParams.get('code')
    console.log(response.headers.get('location'))
    res.send(code);
});

module.exports = router;
