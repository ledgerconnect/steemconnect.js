var steemConnect = require('./index');

steemConnect.isAuthenticated(function(err, result) {
	console.log(err, result);
});