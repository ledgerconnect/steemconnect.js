var steemConnect = require('./lib/steemconnect');

var username = process.env.STEEM_USERNAME;
var password = process.env.STEEM_PASSWORD;

steemConnect.auth.verify(username, password, ['owner', 'active', 'posting']);

/*
steemConnect.token.get(username, password, function(err, token){
	console.log(err, token);
});
*/