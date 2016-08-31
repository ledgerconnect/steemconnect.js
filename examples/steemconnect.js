(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
steemconnect = require('./steemconnect');
},{"./steemconnect":2}],2:[function(require,module,exports){
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
},{}]},{},[1]);
