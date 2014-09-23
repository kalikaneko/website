#!/usr/bin/env node

var fs = require('fs')
  , http = require('http')
  , stack = require('stack')
  , route = require('tiny-route')
  , assets = require('ecstatic')
  , config = require('./config')
  , axm = require('axm')
  , db = require('level')(config.db_path, config.db_opts)
  , port = process.env.PORT || config.port

// create the level db folder if it does not exists
if(!fs.existsSync(config.db_path)){
     fs.mkdirSync(config.db_path, 0766, function(err){
       if(err){
         console.log(err);
       }
     });
 }

stack.errorHandler = function error(req, res, err) {
  res.statusCode = 302
  res.setHeader('Location', '/')
  res.end()
}

var app = stack(
    route('/email', require('./src/email-submit')(db))
  , route('/confirm', require('./src/email-confirm')(db))
  , assets({ root: __dirname +'/html', handleError: false })
)

process.on('uncaughtException', function (err) {
  console.error('Error at:', new Date)
  console.error(err.stack)
})

var amxEmit = function (txt) {
console.log('amxEmit fired');
axm.emit('test:logtest', {
  text : txt,
  email : 'thorustor@gmail.com'
});
}
amxEmit();

http.createServer(app).listen(port, function() {
  console.log('[PID='+ process.pid +'] server started on port '+ port)
  console.log('(use Ctrl+c to stop the server)')
})

