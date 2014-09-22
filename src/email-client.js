var ready = require('domready')
  , check_email = require('valid-email')
  , loadsvg = require('load-svg')

process.nextTick(function() {
  ready(function() {

    var form  = document.getElementById('signup-form')
      , input_email = ''
      , status_msg  = document.getElementById('status-msg')
      , logoCont = document.getElementById('logoCont')

      loadsvg('/assets/img/squatconf_baguette.svg', function (err, svg) {
          logoCont.appendChild(svg);
      });

    for (var n = 0, l = form.childNodes[1].childNodes.length; n < l; n++) {
      var el = form.childNodes[1].childNodes[n]
      if (el.nodeName === 'INPUT' && el.name === 'email')
        input_email = el
    }

    document
      .getElementById("signup-form")
      .addEventListener("click", function(e) {
        if (e.srcElement.nodeName === 'BUTTON') {
          if (input_email && input_email.value) {
            var is_valid = check_email(input_email.value)
            if (is_valid) {
              var progress = 0
                , timerID  = null
              e.preventDefault()
              status_msg.className = 'info'
              status_msg.innerHTML = "Sending"
              timerID = setInterval(function() {
                if (++progress < 8) {
                  status_msg.innerHTML += "."
                } else {
                  clearInterval(timerID)
                  form.submit()
                }
              }, 150)
            } else {
              e.preventDefault()
              input_email.value = ''
              status_msg.className = 'error'
              status_msg.innerHTML = "that doesn't look like an email address,"
                                     + "<br />please try again..."
              setTimeout(function() { status_msg.innerHTML = '&nbsp;' }, 2000)
            }
          }
        }
      })
  })
})

