var sanitize = require('xss-escape')
  , rn = require('./rng')
  , ip = require('./ip-trace')
  , config = require('../config')

module.exports = function(db) {
  return function (req, res, next) {
    req.resume()

    var params = require('url').parse(req.url, true)

    if (params && params.query.email) {

      var obj = {}
        , email  = sanitize(params.query.email)

      console.log('got email:', params.query)

      obj.token = rn()
      obj.verified = false
      obj.events = { paris: params.query.paris ? true : false }
      obj.trace = ip(req)

      db.put(email, obj, function(err) {
        if (err) return console.error(err)

        // db write OK..
        var nodemailer  = require('nodemailer')
          , transporter = nodemailer.createTransport()
          , url  = 'http://squatconf.eu/confirm'
          , link = url +'?email='+ email +'&token='+ obj.token +'\n\n'

        var opts = {
            from   : config.email.from
          , to     : email
          , subject: config.email.subject
        //, link   : link
          , text   : config.email.bodyText.replace(/\%link\%/, link)
        }

        transporter.sendMail(opts, function(err, data) {
          if (err) return console.error(err)

          // validation email sent
          console.log('email sent..', opts)

          res.statusCode = 302
          res.setHeader('Location', '/')
          return res.end()
        })
      })
    }

    if (next) return next()
  }
}

