module.exports = function(req, res, next) {

  //
  res.end('<html><h2>confirmed</h2></html>')

  next()
}

