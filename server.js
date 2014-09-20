#!/usr/bin/env node

var nodemailer = require('nodemailer')
  , transporter = nodemailer.createTransport()
  , server = require('http').createServer(handler)
  , email = require('./config.json').email
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

      /*
      var to_addr = params.query.email // @NOTE:
                                       //     Q: do we trust the user input ?
                                       //     A: FUCK NO !!
        , url  = 'http://squatconf.eu/confirm'
        , link = url +'?email='+ to_addr +'&token='+ rn() +'\n\n'

      var opts = {
          from   : email.from
        , to     : to_addr
        , subject: email.subject
        , text   : email.bodyText.replace(/\%link\%/, link)
      }

      transporter.sendMail(opts, function(err, data) {
        if (err) return console.error('email problem !', err)
        console.log('email sent', data)
      })
      */

      console.log(' got email:', params.query)
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
console.error('['+ process.pid +'] server started on port '+ port)
console.error('(use ctrl+c to stop server)')
