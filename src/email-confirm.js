var sanitize = require('xss-escape')
  , ip = require('./ip-trace')
  , axm = require('axm')

module.exports = function(db) {
  return function (req, res, next) {
    req.resume()

    function error(e) {
      console.error(e)
      return next(e || e.msg || 'ERROR')
    }

    var params = require('url').parse(req.url, true)

    if (params && params.query.email && params.query.token) {

      var email = sanitize(params.query.email)
        , token = sanitize(params.query.token)

      db.get(email, function(err, obj) {
        if (err) {
          axm.emit('error:error', {
            err : err
          });
          return error(err)
        }

        // db read OK..
        if (obj && ! obj.verified) {
          if (obj.token === token) {
            obj.verified = true
            obj.trace = obj.trace.concat(ip(req))

            db.put(email, obj, function(err) {
              if (err) return error(err)
              axm.emit('user:verify', {
                email : email
              });
              // db write OK..
              res.statusCode = 302
              res.setHeader('Location', '/verified.html')
              return res.end()
            })
          }
        } else {
          error('email is already verified: '+ email)
        }
      })

    } else {
      error('invalid input: '+ JSON.stringify(params.query))
    }
  }
}

