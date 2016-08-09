var steemConnect = require('./lib/steemconnect');

var username = 'USERNAME';
var password = 'PASSWORD';

steemConnect.token.get(username, password, function(err, token){
	console.log(err, token);
});