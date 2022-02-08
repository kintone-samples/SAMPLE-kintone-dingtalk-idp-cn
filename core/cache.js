const cache = require('memory-cache');
const { timeout } = require('./constants');

module.exports.get = async (key) => {
  const v = cache.get(key);
  if (v) return v;
  const options = cache.get(`_key:${key}`);
  if (!options) return undefined;
  const dv = options.get.constructor.name === 'AsyncFunction'
    ? await options.get(...options.params)
    : options.get(...options.params);
  cache.put(key, dv, options.timeout);
  return dv;
};

module.exports.set = (key, options) => {
  cache.put(`_key:${key}`, options);
};

module.exports.getValue = async (key, options) => {
  const params = options.params || [];
  const time = options.timeout || timeout.long;
  const v = await this.get(key);
  if (v) return v;
  this.set(key, {
    get: options.func,
    params,
    timeout: time,
  });
  const value = await this.get(key);
  return value;
};
