var sanitize = require('xss-escape')
  , rn = require('./rng')
  , ip = require('./ip-trace')
  , config = require('../config')
  , Mailgun = require('mailgun').Mailgun
  , mg = new Mailgun(config.mailjetKey);




module.exports = function(db) {
  return function (req, res, next) {
    req.resume()

    function error(e) {
      console.error(e)
      return next(e || e.msg || 'ERROR')
    }

    var params = require('url').parse(req.url, true)

    if (params && params.query.email) {

      var obj = {}
        , email  = sanitize(params.query.email)

      db.get(email, function(err, value) {
        if ((err && err.type == 'NotFoundError') || ! value.verified) {

          console.log('got email:', params.query)

          obj.token = rn()
          obj.verified = false
          obj.events = { paris: params.query.paris ? true : false }
          obj.trace = ip(req)

          db.put(email, obj, function(err) {
            if (err) return error(err)

            // db write OK..
            var url  = config.host +'/confirm'
              , qstr = '?email='+ email +'&token='+ obj.token
              , link = url + qstr +'\n\n'
              , opts = {
                from   : config.email.from
              , to     : email
              , subject: config.email.subject
              , text   : config.email.bodyText.replace(/\%link\%/, link)
            }

            mg.sendText(
              opts.from
            , email
            , opts.subject
            , opts.text
            ,  {}
            ,  function(err) {
                if (err) console.log('Guru meditation: ' + err);
                else{
                  res.statusCode = 302
                  res.setHeader('Location', '/')
                  console.log('email sent..', opts)}
                  return res.end()
            });




          })

        } else {
          error('already verified: '+ email)
        }
      })

    } else {
      error('invalid input: '+ JSON.stringify(params.query))
    }
  }
}

