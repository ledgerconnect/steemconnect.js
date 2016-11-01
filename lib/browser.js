'use strict';

/* eslint-env browser */

var steemconnect = require('./steemconnect');

if (typeof window !== 'undefined') {
  window.steemconnect = steemconnect;
}

if (typeof global !== 'undefined') {
  global.steemconnect = steemconnect;
}

exports = module.exports = steemconnect;