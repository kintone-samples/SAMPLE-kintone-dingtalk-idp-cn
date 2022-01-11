const fs = require('fs')
const path = require('path')
const http = require('http');
const https = require('https');
const samlp = require('samlp')
const util = require('util')
require('dotenv').config('./env')

module.exports.agent = (_parsedURL) => _parsedURL.protocol == 'http:' ? new http.Agent({ keepAlive: true }) : new https.Agent({ keepAlive: true });

module.exports.manager = {
    domain : process.env.DOMAIN,
    appid : process.env.APPID,
    token : process.env.TOKEN
}

module.exports.credentials = {
    cert : fs.readFileSync(path.join(__dirname, '../idp-public-cert.pem')),
    key : fs.readFileSync(path.join(__dirname, '../idp-private-key.pem')),
}

module.exports.issuer = 'urn:cn:idp'

module.exports.asyncParseRequest = util.promisify(samlp.parseRequest)
