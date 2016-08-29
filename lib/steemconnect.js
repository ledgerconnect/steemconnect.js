module.exports = {
	isAuthenticated: function(callback) {
		this.send('https://steemconnect.com/api/verify', {}, function (response) {
			callback('', response);
		});
	},
	vote: function(voter, author, permlink, weight, callback) {
		var params = {voter: voter, author: author, permlink: permlink, weight: weight};
		this.send('https://steemconnect.com/api/vote', params, function (response) {
			callback('', response);
		});
	},
	comment: function(parentAuthor, parentPermlink, author, permlink, title, body, jsonMetadata, callback) {
		var params = {parentAuthor: parentAuthor, parentPermlink: parentPermlink, author: author, permlink: permlink, title: title, body: body, jsonMetadata: jsonMetadata};
		this.send('https://steemconnect.com/api/comment', params, function (response) {
			callback('', response);
		});
	},
	send: function(url, params, callback) {
		params = params || {};
		params = this.params(params);
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.withCredentials = true;
		xmlHttp.onreadystatechange = function() {
			if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
				callback(JSON.parse(xmlHttp.responseText));
		};
		xmlHttp.open('GET', url + params, true);
		xmlHttp.send(null);
	},
	params: function(params) {
		return '?' + Object.keys(params).map(function(key){
				return key + '=' + params[key];
			}).join('&');
	}
};