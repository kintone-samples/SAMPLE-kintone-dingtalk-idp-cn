const constants = require('./constants')
const cache = require('./cache')
const Kintone = require('./repositories/kintone')

const getSetting = async (domain) => {
    const kintone = new Kintone(constants.manager)
    return await kintone.getSetting(domain)
}

module.exports.get = async (domain) =>{
    const setting = await cache.get(`setting:${domain}`)
    if (setting) return setting
    cache.set(`setting:${domain}`,{
        get:getSetting,
        params:[domain],
        timeout:7200
    })
    return await cache.get(`setting:${domain}`)
}