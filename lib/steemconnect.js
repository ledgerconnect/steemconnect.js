'use strict';
var fetch = require('isomorphic-fetch');
var qs = require('querystring');

var debug = require('debug')('steemconnect');

var steemconnect = {}
exports = module.exports = steemconnect;

steemconnect.send = function send(url, params, callback) {
  var retP = fetch(url + '?' + qs.stringify(params))
    .then(function (res) {
      debug('GET ' + res.status + ' ' + url);
      if (res.status >= 400) {
        var err = new Error('steemconnect API call failed with ' + res.status);
        err.res = res;
        throw err;
      }
      return res.json();
    });

  if (!callback) return retP;

  return retP.then(function (ret) {
    callback(null, ret);
  }, function (err) {
    callback(err);
  });
};

steemconnect.isAuthenticated = function (callback) {
  return steemconnect.send('https://steemconnect.com/api/verify', {}, callback);
};

steemconnect.vote = function (voter, author, permlink, weight, callback) {
  var params = {
    voter: voter,
    author: author,
    permlink: permlink,
    weight: weight
  };
  return steemconnect.send('https://steemconnect.com/api/vote', params, callback);
};

steemconnect.comment = function (parentAuthor, parentPermlink, author, permlink, title, body, jsonMetadata, callback) {
  var params = {
    parentAuthor: parentAuthor,
    parentPermlink: parentPermlink,
    author: author,
    permlink: permlink,
    title: title,
    body: body,
    jsonMetadata: jsonMetadata
  };
  return steemconnect.send('https://steemconnect.com/api/comment', params, callback);
};
