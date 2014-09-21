var sanitize = require('xss-escape')
  , rn = require('./rng')
  , ip = require('./ip-trace')
  , config = require('../config')
  , db = require('level')(config.db_path, { valueEncoding: 'json' })

module.exports = function() {
  return function (req, res, next) {

    req.resume()

    /*
    function error(err) {
      if (next) return next(err)
      res.writeHead(400, { 'Content-Type': 'text/html' })
      res.end(err.message || err)
    }
    */

    var params = require('url').parse(req.url, true)

    if (params && params.query.email) {

      res.writeHead(200, { 'Content-Type': 'text/html' })
      return res.end(params.query)
      //console.log('got email:', params.query)

      var obj = {}
        , email  = sanitize(params.query.email)

      obj.token = rn()
      obj.verified = false
      obj.events = { paris: params.query.paris ? true : false }
      obj.trace = ip(req)

      db.put(email, obj, function(err) {
        if (err) throw err

        // else.. db updated OK
        db.get(email, function (err, value) {
          if (err) return console.error('Ooops!', err)

          console.log('> '+ email, value)
        })
      })

      var nodemailer  = require('nodemailer')
        , transporter = nodemailer.createTransport()
        , config = require('./config.json')
        , url  = 'http://squatconf.eu/confirm'
        , link = url +'?email='+ email +'&token='+ obj.token +'\n\n'

      var opts = {
          from   : config.email.from
        , to     : email
        , subject: config.email.subject
      //, text   : config.email.bodyText.replace(/\%link\%/, link)
      }
      console.log('mockmail sent...', opts)

      /*
      transporter.sendMail(opts, function(err, data) {
        if (err) throw err
        // validation email sent
        console.log('email sent..', data)
      })
      */

    //} else {
    }

    res.statusCode = 302
    res.setHeader('Location', '/')
    res.end()

    //}

    //if (next) return next()
  }
}


