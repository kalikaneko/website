(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],2:[function(require,module,exports){
/*!
  * domready (c) Dustin Diaz 2014 - License MIT
  */
!function (name, definition) {

  if (typeof module != 'undefined') module.exports = definition()
  else if (typeof define == 'function' && typeof define.amd == 'object') define(definition)
  else this[name] = definition()

}('domready', function () {

  var fns = [], listener
    , doc = document
    , hack = doc.documentElement.doScroll
    , domContentLoaded = 'DOMContentLoaded'
    , loaded = (hack ? /^loaded|^c/ : /^loaded|^i|^c/).test(doc.readyState)


  if (!loaded)
  doc.addEventListener(domContentLoaded, listener = function () {
    doc.removeEventListener(domContentLoaded, listener)
    loaded = 1
    while (listener = fns.shift()) listener()
  })

  return function (fn) {
    loaded ? fn() : fns.push(fn)
  }

});

},{}],3:[function(require,module,exports){
module.exports = require('./lib/valid-email');
},{"./lib/valid-email":4}],4:[function(require,module,exports){
/*!
 * Valid Email
 * Copyright(c) 2013 John Henry
 * MIT Licensed
 */

/**
 * Valid-Email:
 *
 * An alternative to using a regular expression to validate email.
 * Inspired by: 
 *      http://stackoverflow.com/questions/997078/email-regular-expression
 *      http://stackoverflow.com/questions/201323/using-a-regular-expression-to-validate-an-email-address
 *
 * Examples:
 *     console.log(require('valid-email')('john@iamjohnhenry.com'))//#true
 *     console.log(require('valid-email')('iamjohnhenry.com'))//#false
 *
 * @param {String} email 
 * // potential email address
 * @return {Boolean}
 * @api public
 */
module.exports = function valid(email){
    var at = email.search("@");
    if (at <0) return false;
    var user = email.substr(0, at);
    var domain = email.substr(at+1);
    var userLen = user.length;
    var domainLen = domain.length;
    if (userLen < 1 || userLen > 64) return false;// user part length exceeded
    if (domainLen < 1 || domainLen > 255) return false;// domain part length exceeded
    if (user.charAt(0) === '.' || user.charAt(userLen-1) === '.') return false;// user part starts or ends with '.'
    if (user.match(/\.\./)) return false;// user part has two consecutive dots
    if (!domain.match(/^[A-Za-z0-9.-]+$/)) return false;// character not valid in domain part
    if (domain.match( /\\.\\./)) return false;// domain part has two consecutive dots
    if (!user.replace("\\\\","").match(/^(\\\\.|[A-Za-z0-9!#%&`_=\\/$\'*+?^{}|~.-])+$/)) if (!user.replace("\\\\","").match(/^"(\\\\"|[^"])+"$/)) return false
    return true;
}
},{}],5:[function(require,module,exports){
(function (process){
var ready = require('domready')
  , check_email = require('valid-email')

process.nextTick(function() {
  ready(function() {

    var form  = document.getElementById('signup-form')
      , input_email = ''

    for (var n = 0, l = form.childNodes.length; n < l; n++) {
      var el = form.childNodes[n]
console.dir(el)
      if (el.nodeName === 'INPUT' && el.name === 'email')
        input_email = el.nodeValue
    }

    document
      .getElementById("signup-form")
      .addEventListener("click", function() {
        if (input_email) {
          var is_valid = check_email(input_email)
          if (is_valid) {
            alert('got it, thanks '+ input_email)
            form.submit()
          } else {
            input_email = ''
            alert("that doesn't look like an email address, please try again...")
          }
        }
      })
  })
})


}).call(this,require('_process'))
},{"_process":1,"domready":2,"valid-email":3}]},{},[5]);
