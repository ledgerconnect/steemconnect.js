/* eslint-env browser */

const sc2 = require('./sc2');

if (typeof window !== 'undefined') {
  window.sc2 = sc2;
}

if (typeof global !== 'undefined') {
  global.sc2 = sc2;
}

module.exports = sc2;