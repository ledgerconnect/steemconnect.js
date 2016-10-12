'use strict';

var fetch = require('isomorphic-fetch');
var qs = require('querystring');

var debug = require('debug')('steemconnect');

var steemconnect = {};
var basePath = 'https://steemconnect.com/api';

exports = module.exports = steemconnect;

steemconnect.send = function send(url, params, callback) {
  var retP = fetch(url + '?' + qs.stringify(params))
    .then(function (res) {
      debug('GET ' + res.status + ' ' + url);
      if (res.status >= 400) {
        var err = new Error('Steem Connect API call failed with ' + res.status);
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
  return steemconnect.send(`${basePath}/verify`, {}, callback);
};

steemconnect.vote = function (voter, author, permlink, weight, callback) {
  var params = {
    voter: voter,
    author: author,
    permlink: permlink,
    weight: weight
  };
  return steemconnect.send(`${basePath}/vote`, params, callback);
};

steemconnect.upvote = function (voter, author, permlink, weight, callback) {
  var params = {
    voter: voter,
    author: author,
    permlink: permlink,
    weight: weight
  };
  return steemconnect.send(`${basePath}/upvote`, params, callback);
};

steemconnect.downvote = function (voter, author, permlink, weight, callback) {
  var params = {
    voter: voter,
    author: author,
    permlink: permlink,
    weight: weight
  };
  return steemconnect.send(`${basePath}/downvote`, params, callback);
};

steemconnect.follow = function (follower, following, callback) {
  var params = {
    follower: follower,
    following: following
  };
  return steemconnect.send(`${basePath}/follow`, params, callback);
};

steemconnect.unfollow = function (follower, following, callback) {
  var params = {
    follower: follower,
    following: following
  };
  return steemconnect.send(`${basePath}/unfollow`, params, callback);
};

steemconnect.ignore = function (follower, following, callback) {
  var params = {
    follower: follower,
    following: following
  };
  return steemconnect.send(`${basePath}/ignore`, params, callback);
};

steemconnect.reblog = function (account, author, permlink, callback) {
  var params = {
    account: account,
    author: author,
    permlink: permlink
  };
  return steemconnect.send(`${basePath}/reblog`, params, callback);
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
  return steemconnect.send(`${basePath}/comment`, params, callback);
};

steemconnect.deleteComment = function (author, permlink, callback) {
  var params = {
    author: author,
    permlink: permlink
  };
  return steemconnect.send(`${basePath}/deleteComment`, params, callback);
};

steemconnect.post = function (author, permlink, title, body, jsonMetadata, callback) {
  var params = {
    author: author,
    permlink: permlink,
    title: title,
    body: body,
    jsonMetadata: jsonMetadata
  };
  return steemconnect.send(`${basePath}/post`, params, callback);
};

steemconnect.escrowTransfer = function (from, to, amount, memo, escrowId, agent, fee, jsonMeta, expiration, callback) {
  var params = {
    from: from,
    to: to,
    amount: amount,
    memo: memo,
    escrow_id: escrowId,
    agent: agent,
    fee: fee,
    json_meta: jsonMeta,
    expiration: expiration
  };
  return steemconnect.send(`${basePath}/escrowTransfer`, params, callback);
};

steemconnect.escrowDispute = function (from, to, escrowId, who, callback) {
  var params = {
    from: from,
    to: to,
    escrow_id: escrowId,
    who: who
  };
  return steemconnect.send(`${basePath}/escrowDispute`, params, callback);
};

steemconnect.escrowRelease = function (from, to, escrowId, who, amount, callback) {
  var params = {
    from: from,
    to: to,
    escrow_id: escrowId,
    who: who,
    amount: amount
  };
  return steemconnect.send(`${basePath}/escrowRelease`, params, callback);
};
