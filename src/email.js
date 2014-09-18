var ready = require('domready')
  , check_email = require('valid-email')

process.nextTick(function() {
  ready(function() {

    var form  = document.getElementById('signup-form')
      , input_email = ''

    for (var n = 0, l = form.childNodes[1].childNodes.length; n < l; n++) {
      var el = form.childNodes[1].childNodes[n]
      if (el.nodeName === 'INPUT' && el.name === 'email')
        input_email = el
    }

    document
      .getElementById("signup-form")
      .addEventListener("click", function() {
        if (input_email && input_email.value) {
          var is_valid = check_email(input_email.value)
          if (is_valid) {
            alert('got it, thanks '+ input_email.value)
            form.submit()
          } else {
            input_email.value = ''
            alert("that doesn't look like an email address, please try again...")
          }
        }
      })
  })
})

