#!/usr/bin/env node

var http = require('http')
  , stack = require('stack')
  , route = require('tiny-route')
  , assets = require('ecstatic')
  , join = require('path').join
  , fs = require('fs')
  , port = process.env.PORT || require('./config').port

// create the level db folder if it does not exists
if(!fs.existsSync('./db/squatconf')){
     fs.mkdirSync('./db/squatconf', 0766, function(err){
       if(err){
         console.log(err);
       }
     });
 }

var app = stack(
    route('/email', require('./src/email-submit'))
  , route('/confirm', require('./src/email-confirm'))
  , assets(join(__dirname, 'html'))
)

process.on('uncaughtException', function (err) {
  console.error('Error at:', new Date)
  console.error(err.stack)
})

http.createServer(app).listen(port, function() {
  console.log('['+ process.pid +'] server started on port '+ port)
  console.log('(use Ctrl+c to stop the server)')
})

