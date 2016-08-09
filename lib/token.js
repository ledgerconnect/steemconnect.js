var axios = require('axios');

var Token = {};

Token.get = function(username, password, callback){
	axios.get('https://api.steemconnect.com/login?username=' + username + '&password=' + password)
		.then(function(response){
			callback(null, response.data.token);
		});
};

Token.verify = function(token){
	axios.get('https://api.steemconnect.com/token?username=' + username + '&password=' + password)
		.then(function(response){
			callback(null, response.data);
		});
};


module.exports = Token;