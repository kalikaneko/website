#!/usr/bin/env node

var server = require('http').createServer(handler)
  , sanitize = require('xss-escape')
  , rn = require('./src/rng')
  , fs = require('fs')
  , re = new RegExp('\.js$', 'i')
  , port = process.env.PORT || /*80*/ 8000

function handler(req, res) {

  // process incoming requests.
  if (req.url == '/') req.url = '/index.html'
  else if (re.test(req.url))
    res.setHeader('Content-Type', 'application/javascript')

  if (/^\/confirm\?/.test(req.url)) {

    // @TODO
    // compare submitted token with the token stored in our database.

    res.statusCode = 302
    res.setHeader('Location', '/')
    return res.end()
  }

  if (/^\/email\?/.test(req.url)) {
    var params = require('url').parse(req.url, true)
    if (params && params.query.email) {
      //console.log('got email:', params.query)

      var obj = {}
        , email  = sanitize(params.query.email)
      obj.token = rn()
      obj.verified = false
      obj.events = { paris: params.query.paris ? true : false }
      obj.trace = (req.headers['x-forwarded-for'] || '').split(',')
                      || [ req.connection.remoteAddress ]

      var db = require('level')('./db/squatconf', { valueEncoding: 'json' })
      db.put(email, obj, function(err) {
        if (err) cb(err)
        // else.. db updated OK
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
        , text   : config.email.bodyText.replace(/\%link\%/, link)
      }

      transporter.sendMail(opts, function(err, data) {
        if (err) throw err
        // validation email sent
        console.log('email sent..', data)
      })
    }

    res.statusCode = 302
    res.setHeader('Location', '/')
    return res.end()
  }

  // serve static assets
  var rs = fs.createReadStream(__dirname +'/html'+ req.url)
  rs.pipe(res)
}

process.on('uncaughtException', function (err) {
  console.error('Error at:', new Date)
  console.error(err.stack)
})

server.listen(port)
console.log('['+ process.pid +'] server started on port '+ port)
console.log('(use Ctrl+c to stop the server)')

