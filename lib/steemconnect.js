var axios = require('axios');

module.exports = {
	isAuthenticated: function(callback) {
		axios.get('https://steemconnect.com/api/verify')
			.then(function (response) {
				callback('', response.data);
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
	}
};