var express = require('express');
var router = express.Router();
var fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
var cache = require('memory-cache');

const appid = '121'
const token = 'ND5DMUQu48S4kF34mFKg8b65Q2aOyLmAvOnStW2d'
const domain = 'cndevyjhkud.cybozu.cn'


async function getSetting(domain){
    const params = `?app=${appid}&query=${encodeURIComponent(`domain = "${domain}" limit 1`)}&fields[0]=${encodeURIComponent('appid')}&fields[1]=${encodeURIComponent('token')}&fields[2]=${encodeURIComponent('appSecret')}&fields[4]=${encodeURIComponent('appKey')}`
    const response = await fetch(`https://${domain}/k/v1/records.json${params}`,
      { 
          headers: {
              'X-Cybozu-API-Token': token,
          }
      });
    const res = await response.json()
    return {
        appid:res.records[0].appid.value,
        token:res.records[0].token.value,
        appSecret:res.records[0].appSecret.value,
        appKey:res.records[0].appKey.value,
    }
}

/* GET home page. */
router.get('/', async function(req, res, next) {
  const setting = await getSetting(domain)
  cache.put('setting', setting);
  res.render('sso', { appKey : setting.appKey });
});

module.exports = router;