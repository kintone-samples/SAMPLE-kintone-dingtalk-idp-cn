const fs = require('fs')
const path = require('path')
const http = require('http');
const https = require('https');

module.exports.agent = (_parsedURL) => _parsedURL.protocol == 'http:' ? new http.Agent({ keepAlive: true }) : new https.Agent({ keepAlive: true });

module.exports.manager = {
    domain : 'cndevyjhkud.cybozu.cn',
    appid : 121,
    token : 'ND5DMUQu48S4kF34mFKg8b65Q2aOyLmAvOnStW2d'
}

module.exports.credentials = {
    cert : fs.readFileSync(path.join(__dirname, '../idp-public-cert.pem')),
    key : fs.readFileSync(path.join(__dirname, '../idp-private-key.pem')),
}

