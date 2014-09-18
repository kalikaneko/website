#!/usr/bin/env node

var server = require('http').createServer(handler)
  , fs = require('fs')
  , re = new RegExp('\.js$', 'i')
  , port = process.env.PORT || /*80*/ 8000

function handler(req, res) {

  // process incoming requests.
  if (req.url == '/') req.url = '/index.html'
  else if (re.test(req.url))
    res.setHeader('Content-Type', 'application/javascript')

  if (/^\/email\?/.test(req.url)) {
    var params = require('url').parse(req.url, true)
    console.log('got email:', params.query)
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
console.log('server started on port '+ port)
