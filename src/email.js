var ready = require('domready')

process.nextTick(function() {
  ready(function() {

console.log('ready')

  })
})

