module.exports = {
	isAuthenticated: function(callback) {
		this.send('https://steemconnect.com/api/verify', [], function (response) {
				callback('', response);
			});
	},
	vote: function(author, permlink, weight, callback) {
		var params = {author: author, permlink: permlink, weight: weight};
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
		params = JSON.stringify(params);
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.withCredentials = true;
		xmlHttp.onreadystatechange = function() {
			if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
				callback(JSON.parse(xmlHttp.responseText));
		};
		xmlHttp.open('GET', url, true);
		xmlHttp.send(params);
	}
};