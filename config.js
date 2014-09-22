var join = require('path').join
  , name = 'squatconf'
  , cwd  = process.cwd()

module.exports = require('rc')(name, {
    db_opts: { valueEncoding: 'json' }
  , db_path: join(cwd, 'db', name)
  , port: 8000
  , host: "squatconf.eu"
  , email: {
        from     : "no-reply@squatconf.eu"
      , subject  : "Hello, everyone is welcome at SquatConf.."
      , bodyText : "Please verify that you wish to signup by following this link\n%link%\nYou can ignore this message if you DID NOT request to signup at our website\nhttp://squatconf.eu\n\nThe next event is in Paris, we hope to see you there !!\n\nKind regards from the team,\nSquatConf Paris 2014"
  }
})

