var sanitize = require('xss-escape')
  , ip = require('./ip-trace')

module.exports = function(db) {
  return function (req, res, next) {
    req.resume()

    var params = require('url').parse(req.url, true)

    if (params && params.query.email && params.query.token) {

      var email = sanitize(params.query.email)
        , token = sanitize(params.query.token)

      db.get(email, function(err, obj) {
        if (err) return console.error(err)

        // db read OK..
        if (obj && obj.token === token) {
          obj.verified = true
          obj.trace = obj.trace.concat(ip(req))

          db.put(email, obj, function(err) {
            if (err) return console.error(err)

            // db write OK..
            res.statusCode = 302
            res.setHeader('Location', '/verified.html')
            return res.end()
          })
        }
      })

      if (next) return next()
    }
  }
}

