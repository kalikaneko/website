module.exports = function(req) {
  if (req.headers['x-forwarded-for']) {
    return req.headers['x-forwarded-for'].split(',')
  } else {
    return [ req.connection.remoteAddress ]
  }
}

