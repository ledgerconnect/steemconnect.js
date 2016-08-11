var axios = require('axios');

var Token = {};

Token.get = function(username, password, callback){
	var code = (username.length > 16)? username : false;
	callback = (code)? password : callback;
	var url = 'https://api.steemconnect.com/login?';
	url += (code)? 'code=' + code : 'username=' + username + '&password=' + password;
	axios.post(url)
		.then(function(response){
			callback('', response.data.token);
		});
};

Token.verify = function(token){
	axios.post('https://api.steemconnect.com/token?token=' + token)
		.then(function(response){
			callback('', response.data);
		});
};


module.exports = Token;