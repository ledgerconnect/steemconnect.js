var axios = require('axios');

module.exports = {
	isAuthenticated: function(callback) {
		this.send('https://steemconnect.com/api/verify', function (response) {
				callback('', response);
			});
	},
	vote: function(author, permlink, weight, callback) {
		axios.get('https://steemconnect.com/api/vote', {params: {author: author, permlink: permlink, weight: weight}})
			.then(function (response) {
				callback('', response.data);
			});
	},
	comment: function(parentAuthor, parentPermlink, author, permlink, title, body, jsonMetadata, callback) {
		axios.get('https://steemconnect.com/api/comment', {params: {parentAuthor: parentAuthor, parentPermlink: parentPermlink, author: author, permlink: permlink, title: title, body: body, jsonMetadata: jsonMetadata}})
			.then(function (response) {
				callback('', response.data);
			});
	},
	send: function(url, callback) {
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.withCredentials = true;
		xmlHttp.onreadystatechange = function() {
			if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
				callback(xmlHttp.responseText);
		};
		xmlHttp.open('GET', url, true);
		xmlHttp.send(null);
	}
};