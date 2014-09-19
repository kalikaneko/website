module.exports = function() {
  var crypto = require('crypto')

  function rng_Base64(len) {
    return crypto.randomBytes(Math.ceil(len * 3 / 4))
        .toString('base64')
        .slice(0, len)
        .replace(/\+/g, '0')
        .replace(/\//g, '0')
  }

  return [   rng_Base64(8)
           , rng_Base64(4)
           , rng_Base64(4)
           , rng_Base64(4)
           , rng_Base64(12)
         ]
         .join('-')
}

