var steemConnect = require('./lib/steemconnect');

var username = process.env.STEEM_USERNAME;
var password = process.env.STEEM_PASSWORD;

var privKeys = steemConnect.auth.getPrivateKeys(username, password, ['memo', 'active', 'posting']);
console.log(privKeys);